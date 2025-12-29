import { Measurands } from "./Measurands";

export class Application {
  public measurands = new Measurands();
}

let app: Application | null = null;

export function getApp() {
  if (!app) {
    app = new Application();
  }
  return app;
}
