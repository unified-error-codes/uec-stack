import { createContext } from "react";
import { Application } from "../lib/Application";

export const ApplicationContext = createContext<Application>(
  null as unknown as Application
);
