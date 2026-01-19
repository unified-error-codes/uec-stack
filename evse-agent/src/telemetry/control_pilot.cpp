#include <opentelemetry/metrics/provider.h>
#include <uec/telemetry/control_pilot.h>

namespace otl = opentelemetry;

namespace uec {
namespace telemetry {

class control_pilot::impl {
public:
  explicit impl(unsigned connector)
      : _meter(make_meter(connector)),
        _voltage_high(_meter->CreateDoubleGauge(
            "evse.cp.voltage.high", "Control Pilot High Voltage.", "V")),
        _voltage_low(_meter->CreateDoubleGauge(
            "evse.cp.voltage.low", "Control Pilot Low Voltage.", "V")),
        _duty(_meter->CreateDoubleGauge("evse.cp.duty_cycle",
                                        "Control Pilot Duty Cycle.", "%")) {}

  void voltage_high(float voltage, const std::string &state) {
    _voltage_high->Record(voltage, {{"state", state}});
  }
  void voltage_low(float voltage) { _voltage_low->Record(voltage); }
  void duty_cycle(float duty) { _duty->Record(duty); }

private:
  otl::nostd::shared_ptr<otl::metrics::Meter> make_meter(unsigned connector) {
    return otl::metrics::Provider::GetMeterProvider()->GetMeter(
        "control_pilot", "1.0.0", "",
        {{"connector", std::to_string(connector)}});
  }

  otl::nostd::shared_ptr<otl::metrics::Meter> _meter;
  otl::nostd::unique_ptr<otl::metrics::Gauge<double>> _voltage_high;
  otl::nostd::unique_ptr<otl::metrics::Gauge<double>> _voltage_low;
  otl::nostd::unique_ptr<otl::metrics::Gauge<double>> _duty;
};

control_pilot::control_pilot(unsigned connector)
    : _impl(std::make_unique<impl>(connector)) {}

control_pilot::~control_pilot() = default;

void control_pilot::voltage_high(float voltage, const std::string &state) {
  _impl->voltage_high(voltage, state);
}

void control_pilot::voltage_low(float voltage) { _impl->voltage_low(voltage); }

void control_pilot::duty_cycle(float duty_cycle) {
  _impl->duty_cycle(duty_cycle);
}

} // namespace telemetry
} // namespace uec
