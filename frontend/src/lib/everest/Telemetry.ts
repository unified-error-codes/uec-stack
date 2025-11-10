import { Mqtt } from '../Mqtt';
import type { Cleanup } from '../utils/Cleanup';

export interface PowerPathController {
    connector_id: number;
    cp_pwm_duty_cycle: number;
    cp_state: string;
    cp_voltage_high: number;
    cp_voltage_low: number;
    error: boolean;
    pp_ohm: number;
    supply_voltage_12V: number;
    supply_voltage_minus_12V: number;
    temperature_car_connector: number;
    temperature_controller: number;
    timestamp: string;
    type: string;
    watchdog_reset_count: number;
}

class Listener<T> {
    private data: T | undefined;
    private listeners = new Array<(data: T) => void>();
    private mqtt: Mqtt;
    private topic: string;

    constructor(mqtt: Mqtt, topic: string) {
        this.mqtt = mqtt;
        this.topic = topic;
        this.mqtt.subscribe<T>(this.topic, data => {
            this.data = data;
            this.notify();
        });
    }

    public onChange(listener: (data: T) => void): Cleanup {
        this.listeners.push(listener);
        if (this.data) {
            listener(this.data);
        }
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify() {
        if (this.data) {
            this.listeners.forEach(listener => listener(this.data as T));
        }
    }
}

export class Telemetry {
    private mqtt: Mqtt;

    public powerPathController;

    constructor(mqtt: Mqtt) {
        this.mqtt = mqtt;
        this.powerPathController = new Listener<PowerPathController>(
            this.mqtt,
            'everest-telemetry/livedata/+/power_path_controller',
        );
    }
}
