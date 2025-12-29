export type Cleanup = () => void;

export interface Measurand {
  id: string;
  tags: Array<string>;
}

export interface Data {
  timestamp: Array<Date>;
  value: Array<number | string>;
}

export type MeasurementsListener = (
  id /*measurand id */ : string,
  data: Data
) => void;

export class Measurands {
  private measurementsListeners = new Array<MeasurementsListener>();
  private timer: NodeJS.Timeout | undefined;

  private randBetween(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  public list(): Array<Measurand> {
    return [
      {
        id: "control-pilot-voltage-plus",
        tags: ["Communication", "LowLevel", "ControlPilot"],
      },
      {
        id: "control-pilot-voltage-minus",
        tags: ["Communication", "LowLevel", "ControlPilot"],
      },
    ];
  }

  public onMeasurements(listener: MeasurementsListener): Cleanup {
    this.measurementsListeners.push(listener);
    if (this.measurementsListeners.length === 1) {
      this.startGenerator();
    }
    return () => {
      this.measurementsListeners = this.measurementsListeners.filter(
        (l) => l !== listener
      );
      if (this.measurementsListeners.length === 0) {
        this.stopGenerator();
      }
    };
  }

  private startGenerator() {
    if (this.timer) {
      return;
    }
    this.timer = setInterval(() => {
      const now = new Date();
      this.list().forEach((m) => {
        this.measurementsListeners.forEach((l) =>
          l(m.id, { timestamp: [now], value: [this.randBetween(-500, 500)] })
        );
      });
    }, 1000);
  }

  private stopGenerator() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}
