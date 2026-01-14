#include "everest.h"
#include "mqtt.h"
#include <boost/asio/signal_set.hpp>
#include <fstream>
#include <iostream>
#include <opentelemetry/exporters/ostream/metric_exporter_factory.h>
#include <opentelemetry/metrics/provider.h>
#include <opentelemetry/sdk/metrics/export/periodic_exporting_metric_reader_factory.h>
#include <opentelemetry/sdk/metrics/export/periodic_exporting_metric_reader_options.h>
#include <opentelemetry/sdk/metrics/meter_context.h>
#include <opentelemetry/sdk/metrics/meter_context_factory.h>
#include <opentelemetry/sdk/metrics/meter_provider_factory.h>

#include <string>

using namespace uec;

namespace otl = opentelemetry;

namespace {

struct config {
  std::string brokers = "127.0.0.1";
  uint16_t port = 1883;
  std::string client_id = "uec-evse-client";
};

void init_opentelemetry(std::ofstream &metrics_file) {
  auto exporter = otl::exporter::metrics::OStreamMetricExporterFactory::Create(
      metrics_file);

  otl::sdk::metrics::PeriodicExportingMetricReaderOptions options;
  options.export_interval_millis = std::chrono::milliseconds(10000);
  options.export_timeout_millis = std::chrono::milliseconds(500);

  auto reader = otl::sdk::metrics::PeriodicExportingMetricReaderFactory::Create(
      std::move(exporter), options);

  auto context = otl::sdk::metrics::MeterContextFactory::Create();
  context->AddMetricReader(std::move(reader));
  auto provider =
      otl::sdk::metrics::MeterProviderFactory::Create(std::move(context));

  std::shared_ptr<opentelemetry::metrics::MeterProvider> api_provider(
      std::move(provider));

  otl::metrics::Provider::SetMeterProvider(api_provider);
}

} // namespace

int main(int argc, char **argv) {
  config cfg;

  if (argc == 4) {
    cfg.brokers = argv[1];
    cfg.port = uint16_t(std::stoi(argv[2]));
    cfg.client_id = argv[3];
  }

  std::ofstream metrics_file("metrics.json");
  init_opentelemetry(metrics_file);

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
