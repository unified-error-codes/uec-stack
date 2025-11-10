'use client';
import { Telemetry } from './everest/Telemetry';
import { Measurands } from './Measurands';
import { Mqtt } from './Mqtt';

export class Application {
    private mqtt = new Mqtt();
    public everest = {
        telemetry: new Telemetry(this.mqtt),
    };
    public measurands = new Measurands(this.everest.telemetry);

    constructor() {
        this.mqtt.connect();
    }
}

let app: Application | null = null;

export function getApp() {
    if (!app) {
        app = new Application();
    }
    return app;
}
