#pragma once
#include "mqtt.h"
#include <boost/mqtt5/types.hpp>
#include <rapidjson/document.h>
// #include <unordered_map>
#include <cstdint>
#include <fstream>
#include <string>
#include <vector>

namespace uec {

struct mqtt_source {
  std::string topic;
  std::string data_path;
  std::string timestamp_path;
};

struct telemetry_config {
  std::string id;
  std::string unit;
  std::string description;
  mqtt_source source;
};

class config_yaml {
public:
  explicit config_yaml(mqtt::client &client, const std::string &config_file);

  void run();

private:
  void parse_config_file(const std::string &config_file);
  void do_subscribe();
  void do_receive();
  bool handle_recv_error(boost::mqtt5::error_code ec);
  void handle_telemetry_data(const std::string &topic,
                             const std::string &payload);
  void write_to_mcap(const std::string &channel_name, uint64_t timestamp,
                     double value);
  void init_mcap_file();

  mqtt::client &_client;
  std::vector<telemetry_config> telemetry_configs;
  std::ofstream mcap_file;
  uint16_t next_channel_id = 1;
};

} // namespace uec
