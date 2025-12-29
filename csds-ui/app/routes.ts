import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("layouts/menu.tsx", [
    index("routes/home.tsx"),
    route("live-data", "routes/live-data.tsx"),
    route("errors-warnings", "routes/errors-warnings.tsx"),
    route("sessions", "routes/sessions.tsx"),
    route("trends", "routes/trends.tsx"),
  ]),
] satisfies RouteConfig;
