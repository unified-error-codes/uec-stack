#include <uec/telemetry/control_pilot.h>

namespace uec {
namespace telemetry {

// TODO: Implement data logging via OpenTelemetry

class control_pilot::impl {
public:
  void voltage_high(float) {}
  void voltage_low(float) {}
  void duty_cycle(float) {}
  void state(std::string) {}
};

control_pilot::control_pilot(unsigned connector)
    : _impl(std::make_unique<impl>()) {}

control_pilot::~control_pilot() = default;

void control_pilot::voltage_high(float voltage) {
  _impl->voltage_high(voltage);
}

void control_pilot::voltage_low(float voltage) { _impl->voltage_low(voltage); }

void control_pilot::duty_cycle(float duty_cycle) {
  _impl->duty_cycle(duty_cycle);
}

void control_pilot::state(std::string state) { _impl->state(std::move(state)); }

} // namespace telemetry
} // namespace uec
