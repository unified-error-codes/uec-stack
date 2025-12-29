import { isRouteErrorResponse, Outlet } from "react-router";
import { IntlProvider } from "react-intl";

import type { Route } from "./+types/root";
import "./app.css";
import { loadMessages } from "./intl";
import { useMemo } from "react";
import { ApplicationContext } from "./contexts/ApplicationContext";
import { getApp } from "./lib/Application";

export default function App() {
  const { locale, messages } = useMemo(() => loadMessages(), []);
  return (
    <ApplicationContext.Provider value={getApp()}>
      <IntlProvider
        locale={locale}
        messages={messages}
        defaultLocale={locale[0]}
      >
        <Outlet />
      </IntlProvider>
    </ApplicationContext.Provider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>Oops!</h1>
      <h3>
        {isRouteErrorResponse(error) ? error.statusText : "Unknown Error"}
      </h3>
    </main>
  );
}
