# UEC Software Stack

A software stack that implements charging station diagnostics based on unified error codes and telemetry.

---

## Software Components

* [**csds/**](./csds/README.md): Charging Station Diagnostic System. The core backend service. It retrieves unified telemetry via GetDiagnostics from the EVSE when a charging session fails and provides a REST API for the csds-ui dashboard.
* **csds-ui/**: A web-based dashboard for CSDS.
* **evse-agent/**: Software designed for seamless integration into any EVSE firmware stack. It provides unified error codes and telemetry to the CSDS backend via OCPP.
