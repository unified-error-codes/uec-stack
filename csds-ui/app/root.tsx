import React from 'react'
import { Outlet } from 'react-router'
import {
  metaConfig,
  ErrorBoundaryTemplate,
  DocumentTemplate,
} from './route-module-exports/'

import type { Route } from './+types/root'
import './app.css'

export default function App() {
  return <Outlet />
}

// below is the configuration of route module exports used by react-router
// reference: https://reactrouter.com/start/framework/route-module

// main HTML document template
export const Layout = DocumentTemplate

// meta tags
export const meta: Route.MetaFunction = metaConfig

type ErrorBoundaryType = (args: Route.ErrorBoundaryProps) => React.JSX.Element
export const ErrorBoundary: ErrorBoundaryType = ErrorBoundaryTemplate
