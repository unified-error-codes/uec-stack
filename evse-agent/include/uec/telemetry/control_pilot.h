#pragma once

#include <memory>
#include <string>

namespace uec {
namespace telemetry {

class control_pilot {
public:
  explicit control_pilot(unsigned connector);
  ~control_pilot();

  void voltage_high(float voltage, const std::string &state);
  void voltage_low(float voltage);
  void duty_cycle(unsigned duty_cycle);

private:
  class impl;
  std::unique_ptr<impl> _impl;
};

} // namespace telemetry
} // namespace uec
