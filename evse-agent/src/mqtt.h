#pragma once

#include <boost/mqtt5/logger.hpp>
#include <boost/mqtt5/mqtt_client.hpp>
#include <boost/mqtt5/reason_codes.hpp>
#include <boost/mqtt5/types.hpp>

namespace uec {

struct mqtt {
  using client = boost::mqtt5::mqtt_client<boost::asio::ip::tcp::socket>;
};

} // namespace uec
