#include "config_yaml.h"
#include <boost/algorithm/string.hpp>
#include <chrono>
#include <cstdio>
#include <cstring>
#include <rapidjson/document.h>
#include <rapidjson/filereadstream.h>
#include <set>
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

std::vector<subscribe_topic>
map_to_subscribe_topic_vector(const std::set<std::string> &topics) {
  std::vector<subscribe_topic> result;
  for (const auto &topic : topics) {
    result.push_back(subscribe_topic{
        topic, subscribe_options{qos_e::at_most_once, no_local_e::no,
                                 retain_as_published_e::dont,
                                 retain_handling_e::send}});
  }
  return result;
}

std::set<std::string>
collect_topics(const std::vector<telemetry_config> &configs) {
  std::set<std::string> unique_topics;
  for (const auto &config : configs) {
    unique_topics.insert(config.source.topic);
  }
  return unique_topics;
}

double extract_value_from_json(const rapidjson::Document &doc,
                               const std::string &data_path) {
  if (data_path.empty()) {
    throw std::invalid_argument("data_path cannot be empty");
  }

  const rapidjson::Value *current = &doc;
  std::istringstream path_stream(data_path);
  std::string path_component;

  std::vector<std::string> path_components;
  boost::split(path_components, data_path, boost::is_any_of("."));

  for (const auto &component : path_components) {
    if (component.empty()) {
      continue;
    }
    if (current->IsObject() && current->HasMember(component.c_str())) {
      current = &(*current)[component.c_str()];
    } else {
      throw std::runtime_error("Invalid data_path: " + data_path);
    }
  }

  if (!current->IsNumber()) {
    throw std::runtime_error("Value at data_path is not a number");
  }

  return current->GetDouble();
}

double extract_timestamp_from_json(const rapidjson::Document &doc,
                                    const std::string &timestamp_path) {
  // If timestamp_path is empty or extraction fails, return current time
  if (timestamp_path.empty()) {
    auto now = std::chrono::system_clock::now();
    auto duration = now.time_since_epoch();
    return std::chrono::duration_cast<std::chrono::duration<double>>(duration)
        .count();
  }

  try {
    return extract_value_from_json(doc, timestamp_path);
  } catch (const std::exception &e) {
    // If extraction fails, fall back to current time
    auto now = std::chrono::system_clock::now();
    auto duration = now.time_since_epoch();
    return std::chrono::duration_cast<std::chrono::duration<double>>(duration)
        .count();
  }
}

} // namespace

config_yaml::config_yaml(mqtt::client &client, const std::string &config_file)
    : _client(client) {
  parse_config_file(config_file);
  init_mcap_file();
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

void config_yaml::run() { do_subscribe(); }

void config_yaml::do_subscribe() {
  _client.async_subscribe(
      map_to_subscribe_topic_vector(collect_topics(telemetry_configs)),
      subscribe_props{},
      [&](error_code ec, std::vector<reason_code> codes,
          suback_props /* props */) {
        if (ec) {
          throw std::runtime_error("Subscribe failed: " + ec.message());
        }
        do_receive();
      });
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
      rapidjson::Document doc;
      if (doc.Parse(payload.c_str()).HasParseError()) {
        throw std::runtime_error("Failed to parse JSON payload");
      }

      try {
        double value = extract_value_from_json(doc, config.source.data_path);
        double timestamp =
            extract_timestamp_from_json(doc, config.source.timestamp_path);

        // Convert timestamp from seconds to nanoseconds (MCAP uses ns)
        uint64_t timestamp_ns = static_cast<uint64_t>(timestamp * 1e9);

        // Write to MCAP file
        write_to_mcap(config.id, timestamp_ns, value);
      } catch (const std::exception &e) {
        throw std::runtime_error("Failed to extract telemetry: " +
                                 std::string(e.what()));
      }
    }
  }
}

void config_yaml::init_mcap_file() {
  // Open MCAP file for writing
  auto now = std::chrono::system_clock::now();
  auto time = std::chrono::system_clock::to_time_t(now);
  char filename[256];
  std::strftime(filename, sizeof(filename), "telemetry_%Y%m%d_%H%M%S.mcap",
                std::localtime(&time));

  mcap_file.open(filename, std::ios::binary);
  if (!mcap_file) {
    throw std::runtime_error("Failed to open MCAP file for writing");
  }

  // Write MCAP header magic
  const char mcap_magic[] = "\x89MCAP0\r\n";
  mcap_file.write(mcap_magic, 8);
  mcap_file.flush();
}

void config_yaml::write_to_mcap(const std::string &channel_name,
                                uint64_t timestamp, double value) {
  if (!mcap_file) {
    return;
  }

  // MCAP message format: opcode (1 byte) + message data
  // Opcode 2 = MESSAGE record
  const uint8_t MESSAGE_OPCODE = 2;

  // Simple MCAP MESSAGE record format:
  // channel_id (2 bytes) + timestamp (8 bytes) + data (8 bytes for double)
  uint16_t channel_id = next_channel_id++;

  mcap_file.write(reinterpret_cast<const char *>(&MESSAGE_OPCODE), 1);
  mcap_file.write(reinterpret_cast<const char *>(&channel_id), 2);
  mcap_file.write(reinterpret_cast<const char *>(&timestamp), 8);
  mcap_file.write(reinterpret_cast<const char *>(&value), 8);
  mcap_file.flush();
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
