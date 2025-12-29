#pragma once
#include "mqtt.h"
#include <boost/mqtt5/types.hpp>
#include <uec/telemetry/control_pilot.h>
#include <unordered_map>

namespace uec {

class everest {
public:
  explicit everest(mqtt::client &client);

  void run();

private:
  void do_subscribe();
  void do_receive();
  bool handle_recv_error(boost::mqtt5::error_code ec);
  void handle_power_path_controller(const std::string &payload);
  uec::telemetry::control_pilot& get_cp_telemetry(unsigned connector);

  mqtt::client &_client;

  std::unordered_map<unsigned /*connector*/, uec::telemetry::control_pilot>
      cp_telemetry;
};

} // namespace uec
