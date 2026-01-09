import type { Route } from '../+types/root'

export default function Home({ loaderData, actionData, params, matches }: any) {
  return (
    <>
      ----------------------------------
      <div>Home route</div>
      <div>
        ----------------------------------
        <h1>args from home component</h1>
        <p>Loader Data: {JSON.stringify(loaderData)}</p>
        <p>Action Data: {JSON.stringify(actionData)}</p>
        <p>Route Parameters: {JSON.stringify(params)}</p>
        <p>Matched Routes: {JSON.stringify(matches)}</p>
      </div>
    </>
  )
}
