import type { Route } from './+types/sessions'

interface SessionDetails extends Route.ComponentProps {
  params: {
    sessionId: string
  }
}

export default function SessionDetails({
  loaderData,
  actionData,
  params,
  matches,
}: SessionDetails) {
  return (
    <>
      ----------------------------------
      <div>Session Details {params.sessionId}</div>
      <div>
        ----------------------------------
        <h1>args from session details component</h1>
        <p>Loader Data: {JSON.stringify(loaderData)}</p>
        <p>Action Data: {JSON.stringify(actionData)}</p>
        <p>Route Parameters: {JSON.stringify(params)}</p>
        <p>Matched Routes: {JSON.stringify(matches)}</p>
      </div>
    </>
  )
}
