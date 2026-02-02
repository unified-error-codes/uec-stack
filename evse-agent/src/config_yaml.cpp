#include "config_yaml.h"
#include <cstdio>
#include <rapidjson/document.h>
#include <rapidjson/filereadstream.h>
#include <sstream>
#include <stdexcept>

using namespace boost::mqtt5;

namespace uec {
namespace {

std::string get_string(const rapidjson::Value &obj, const char *member_name,
                       const std::string &default_value = "") {
  if (!obj.HasMember(member_name)) {
    return default_value;
  }
  const auto &member = obj[member_name];
  if (member.IsString()) {
    return member.GetString();
  }
  return default_value;
}

} // namespace

config_yaml::config_yaml(mqtt::client &client, const std::string &config_file)
    : _client(client) {
  parse_config_file(config_file);
}

void config_yaml::parse_config_file(const std::string &config_file) {
  FILE *fp = std::fopen(config_file.c_str(), "rb");
  if (!fp) {
    throw std::runtime_error("Failed to open config file: " + config_file);
  }

  char readBuffer[65536];
  rapidjson::FileReadStream is(fp, readBuffer, sizeof(readBuffer));
  rapidjson::Document doc;

  if (doc.ParseStream(is).HasParseError()) {
    std::fclose(fp);
    throw std::runtime_error("Failed to parse JSON config file");
  }
  std::fclose(fp);

  // Parse telemetry array
  if (!doc.HasMember("telemetry") || !doc["telemetry"].IsArray()) {
    throw std::runtime_error("No telemetry array found in config file");
  }

  const auto &telemetry_array = doc["telemetry"].GetArray();
  for (const auto &telemetry_obj : telemetry_array) {
    if (!telemetry_obj.IsObject()) {
      continue;
    }

    telemetry_config config;
    config.id = get_string(telemetry_obj, "id");
    config.unit = get_string(telemetry_obj, "unit");
    config.description = get_string(telemetry_obj, "description");

    // Parse source object
    if (telemetry_obj.HasMember("source") &&
        telemetry_obj["source"].IsObject()) {
      const auto &source = telemetry_obj["source"];
      config.source.topic = get_string(source, "topic");
      config.source.data_path = get_string(source, "data_path");
      config.source.timestamp_path = get_string(source, "timestamp_path");
    }

    if (!config.source.topic.empty() && !config.source.data_path.empty()) {
      telemetry_configs.push_back(config);
    }
  }

  if (telemetry_configs.empty()) {
    throw std::runtime_error(
        "No valid telemetry configurations found in config file");
  }
}

void config_yaml::do_receive() {

  _client.async_receive([&](error_code ec, std::string topic,
                            std::string payload, publish_props /* props */) {
    if (!handle_recv_error(ec)) {
      handle_telemetry_data(topic, payload);
      do_receive();
    }
  });
}

void config_yaml::handle_telemetry_data(const std::string &topic,
                                        const std::string &payload) {
  // Find matching telemetry config for this topic
  for (const auto &config : telemetry_configs) {
    if (config.source.topic == topic) {
      // Parse JSON payload to extract data
      rapidjson::Document doc;
      if (doc.Parse(payload.c_str()).HasParseError()) {
        // Invalid JSON, skip
        return;
      }

      // Extract value using data_path
      if (config.source.data_path.empty()) {
        return;
      }

      const rapidjson::Value *current = &doc;
      std::istringstream path_stream(config.source.data_path);
      std::string path_component;

      // Navigate through nested JSON using data_path
      while (std::getline(path_stream, path_component, '.')) {
        if (current->IsObject() && current->HasMember(path_component.c_str())) {
          current = &(*current)[path_component.c_str()];
        } else {
          return;
        }
      }

      // TODO: Process extracted telemetry data
      // This is where you would send the data to the telemetry system
      // For now, we just extract it
      if (current->IsNumber()) {
        // double value = current->GetDouble();
        // TODO: Store or process value with config.id, config.unit, etc.
      }
    }
  }
}

bool config_yaml::handle_recv_error(boost::mqtt5::error_code ec) {
  if (ec) {
    if (ec == boost::mqtt5::client::error::session_expired) {
      do_subscribe();
      return true;
    } else if (ec != boost::mqtt5::client::error::session_expired) {
      throw std::runtime_error("Receive failed: " + ec.message());
    }
  }
  return false;
}

} // namespace uec
