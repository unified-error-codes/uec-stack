#include "everest.h"
#include "mqtt.h"
#include <boost/asio/signal_set.hpp>
#include <iostream>
#include <string>

using namespace uec;

namespace {

struct config {
  std::string brokers = "127.0.0.1";
  uint16_t port = 1883;
  std::string client_id = "uec-evse-client";
};

} // namespace

int main(int argc, char **argv) {
  config cfg;

  if (argc == 4) {
    cfg.brokers = argv[1];
    cfg.port = uint16_t(std::stoi(argv[2]));
    cfg.client_id = argv[3];
  }

  std::cout << "Connecting to brokers: " << cfg.brokers
            << " on port: " << cfg.port << " with client ID: " << cfg.client_id
            << "\n";

  boost::asio::io_context ioc;
  mqtt::client client{ioc};
  everest ev{client};

  boost::asio::signal_set signals(ioc, SIGINT, SIGTERM);
  signals.async_wait([&client](boost::mqtt5::error_code /* ec */,
                               int /* signal */) { client.cancel(); });

  client.brokers(cfg.brokers, cfg.port)
      .credentials(cfg.client_id)
      .async_run([&](boost::mqtt5::error_code ec) {
        if (ec) {
          throw std::runtime_error("MQTT client stopped with error: " +
                                   ec.message());
        }
        ev.run();
      });

  ev.run();

  while (true) {
    try {
      ioc.run();
      break;
    } catch (const std::exception &e) {
      std::cerr << "Exception: " << e.what() << std::endl;
    } catch (...) {
      std::cerr << "Unknown exception occurred" << std::endl;
    }
  }
}
