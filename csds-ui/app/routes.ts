import {
  type RouteConfig,
  index,
  route,
  layout,
  prefix,
} from '@react-router/dev/routes'

export default [
  layout('routes/layout.tsx', [
    index('routes/home.tsx'),
    ...prefix('sessions', [
      index('routes/sessions.tsx'),
      route(':sessionId', 'routes/session-details.tsx'),
    ]),
  ]),
] satisfies RouteConfig
