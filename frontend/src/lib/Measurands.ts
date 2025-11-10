import type { PowerPathController, Telemetry } from './everest/Telemetry';
import type { Cleanup } from './utils/Cleanup';

export type Type = 'Voltage' | 'DutyCycle' | 'State';

export type Location =
    | 'ControlPilotPositive'
    | 'ControlPilotNegative'
    | 'ControlPilot'
    | 'Supply12VPositive'
    | 'Supply12VNegative';

export interface Measurand {
    type: Type;
    location: Location;
    connectors?: Array<number>;
}

export type Listener = (measurands: Array<Measurand>) => void;
export type MeasurementsListener = (
    timestamp: Date,
    data: Array<{ measurand: Measurand; value: number | string }>,
) => void;

export class Measurands {
    private measurementsListeners = new Array<MeasurementsListener>();
    private everestPowerPathControllerData: PowerPathController | undefined;

    constructor(everest: Telemetry) {
        everest.powerPathController.onChange(data => {
            this.everestPowerPathControllerData = data;
            this.notifyMeasurements();
        });
    }

    public onMeasurements(listener: MeasurementsListener): Cleanup {
        this.measurementsListeners.push(listener);
        this.notifyMeasurements();
        return () => {
            this.measurementsListeners = this.measurementsListeners.filter(
                l => l !== listener,
            );
        };
    }

    private notifyMeasurements() {
        if (this.everestPowerPathControllerData) {
            const measurements = toMeasurements(
                this.everestPowerPathControllerData,
            );
            const timestamp = new Date(
                this.everestPowerPathControllerData.timestamp,
            );
            this.measurementsListeners.forEach(listener => {
                listener(timestamp, measurements);
            });
        }
    }
}

const toMeasurements = (
    data: PowerPathController,
): Array<{ measurand: Measurand; value: number | string }> => {
    const ret: Array<{ measurand: Measurand; value: number | string }> = [];
    const connector = data.connector_id;
    ret.push({
        measurand: {
            type: 'Voltage',
            location: 'ControlPilotPositive',
            connectors: [connector],
        },
        value: data.cp_voltage_high,
    });
    ret.push({
        measurand: {
            type: 'Voltage',
            location: 'ControlPilotNegative',
            connectors: [connector],
        },
        value: data.cp_voltage_low,
    });
    ret.push({
        measurand: {
            type: 'State',
            location: 'ControlPilot',
            connectors: [connector],
        },
        value: data.cp_state,
    });
    ret.push({
        measurand: {
            type: 'DutyCycle',
            location: 'ControlPilot',
            connectors: [connector],
        },
        value: data.cp_pwm_duty_cycle,
    });
    ret.push({
        measurand: {
            type: 'Voltage',
            location: 'Supply12VPositive',
            connectors: [connector],
        },
        value: data.supply_voltage_12V,
    });
    ret.push({
        measurand: {
            type: 'Voltage',
            location: 'Supply12VNegative',
            connectors: [connector],
        },
        value: data.supply_voltage_minus_12V,
    });

    return ret;
};
