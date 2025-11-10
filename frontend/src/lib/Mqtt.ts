import mqtt from 'mqtt';
import type { MqttClient } from 'mqtt';
import { matches } from 'mqtt-pattern';
import type { Cleanup } from './utils/Cleanup';

export class Mqtt {
    private client: MqttClient | null = null;
    private subscriptions = new Array<
        [string, (data: any, topic: string) => void]
    >();

    public connect() {
        const url = 'ws://127.0.0.1:9001';
        this.client = mqtt.connect(url);

        this.client.on('connect', () => {
            console.log(`Connected to MQTT broker ${url}`);
            this.subscriptions.forEach(([topic]) => {
                this.client?.subscribe(topic);
            });
        });

        this.client.on('message', (topic, msg) => {
            console.log(`mqtt: ${topic} ${msg}`);
            this.subscriptions.forEach(([subscribedTopic, cb]) => {
                if (matches(subscribedTopic, topic)) {
                    cb(JSON.parse(msg.toString()), subscribedTopic);
                }
            });
        });

        this.client.on('error', error => {
            console.error('MQTT client error:', error);
        });
    }

    public subscribe<T>(
        topic: string,
        cb: (data: T, topic: string) => void,
    ): Cleanup {
        this.subscriptions.push([topic, cb]);
        return () => {};
        // IMPLEMENT ME
    }
}
