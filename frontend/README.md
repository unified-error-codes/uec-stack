# EVerest Diagnostic Frontend

A web-based frontend application designed to visualize EVerest telemetry data. It connects to an MQTT broker to receive real-time data and displays it as interactive plots, aiding in diagnostics and monitoring of your EV charging.

## Features

* **Real-time Visualization:** Plots telemetry data from EVerest as it's published via MQTT.

## Prerequisites

Before you begin, ensure you have the following installed and running:

* [Node.js](https://nodejs.org/) (which includes npm)
* An EVerest instance that is actively publishing telemetry data to an MQTT broker.
* Access to the MQTT broker's URL and port.

## Getting Started

Follow these steps to get the diagnostic frontend up and running on your local machine.

### Install Dependencies

Navigate to the project directory and install the required node modules.

```bash
npm install
```

### Run the Development Server

```bash
npm run dev
```