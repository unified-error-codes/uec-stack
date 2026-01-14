#include "everest.h"
#include <rapidjson/document.h>
#include <stdexcept>

using namespace boost::mqtt5;

namespace uec {
namespace {

auto make_topic(std::string topic) {
  return boost::mqtt5::subscribe_topic{
      std::move(topic),
      boost::mqtt5::subscribe_options{
          qos_e::at_most_once,
          no_local_e::no, // Forward message from Clients with same ID.
          retain_as_published_e::dont, retain_handling_e::send

      }};
}

struct power_path_controller {
  unsigned connector_id = 0;
  double cp_voltage_high = 0.0;
  double cp_voltage_low = 0.0;
  double cp_pwm_duty_cycle = 0.0;
  std::string cp_state;
};

template <typename T>
T get_member(const rapidjson::Value &obj, const char *member_name) {
  if (!obj.HasMember(member_name)) {
    throw std::runtime_error(std::string("Missing member: ") + member_name);
  }
  const auto &member = obj[member_name];
  if (!member.Is<T>()) {
    throw std::runtime_error(std::string("Invalid type for member: ") +
                             member_name);
  }
  return member.Get<T>();
}

power_path_controller parse(const std::string &payload) {
  power_path_controller ppc;

  rapidjson::Document doc;
  doc.Parse(payload);
  if (doc.HasParseError()) {
    throw std::runtime_error("JSON parse error");
  }

  ppc.connector_id = get_member<unsigned>(doc, "connector_id");
  ppc.cp_voltage_high = get_member<double>(doc, "cp_voltage_high");
  ppc.cp_voltage_low = get_member<double>(doc, "cp_voltage_low");
  ppc.cp_pwm_duty_cycle = get_member<double>(doc, "cp_pwm_duty_cycle");
  ppc.cp_state = get_member<std::string>(doc, "cp_state");
  return ppc;
}

} // namespace

everest::everest(mqtt::client &client) : _client(client) {}

void everest::run() { do_subscribe(); }

void everest::do_subscribe() {
  auto topic = make_topic("everest-telemetry/livedata/+/power_path_controller");
  _client.async_subscribe({topic}, subscribe_props{},
                          [&](error_code ec, std::vector<reason_code> codes,
                              suback_props /* props */) {
                            if (ec) {
                              throw std::runtime_error("Subscribe failed: " +
                                                       ec.message());
                            }
                            do_receive();
                          });
}

void everest::do_receive() {

  _client.async_receive([&](error_code ec, std::string topic,
                            std::string payload, publish_props /* props */) {
    if (!handle_recv_error(ec)) {
      do_receive();
      handle_power_path_controller(payload);
    }
  });
}

bool everest::handle_recv_error(boost::mqtt5::error_code ec) {
  if (ec) {
    if (ec == boost::mqtt5::client::error::session_expired) {
      do_subscribe();
      return true;
    } else {
      do_receive();
      throw std::runtime_error("Receive failed: " + ec.message());
    }
  }
  return false;
}

void everest::handle_power_path_controller(const std::string &payload) {
  auto ppc = parse(payload);

  auto &cp = get_cp_telemetry(ppc.connector_id);
  cp.duty_cycle(ppc.cp_pwm_duty_cycle);
  cp.voltage_high(ppc.cp_voltage_high, ppc.cp_state);
  cp.voltage_low(ppc.cp_voltage_low);
}

uec::telemetry::control_pilot &everest::get_cp_telemetry(unsigned connector) {
  auto it = cp_telemetry.find(connector);
  if (it == cp_telemetry.end()) {
    it =
        cp_telemetry
            .emplace(std::piecewise_construct, std::forward_as_tuple(connector),
                     std::forward_as_tuple(connector))
            .first;
  }
  return it->second;
}

} // namespace uec
