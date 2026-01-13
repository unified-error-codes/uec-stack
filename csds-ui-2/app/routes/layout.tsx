import { Outlet } from 'react-router'
import { MainNavigation } from '~/navigation/navigation'
import { PageFrame } from '~/ui/frame'

export default function Layout({
  loaderData,
  actionData,
  params,
  matches,
}: any) {
  return <PageFrame />
}

function InitialLayout({ loaderData, actionData, params, matches }: any) {
  return (
    <div style={{ padding: '16px' }}>
      ----------------------------------
      <div>Layout</div>
      <MainNavigation />
      <div>
        ----------------------------------
        <h1>Args from Layout component</h1>
        <p>Loader Data: {JSON.stringify(loaderData)}</p>
        <p>Action Data: {JSON.stringify(actionData)}</p>
        <p>Route Parameters: {JSON.stringify(params)}</p>
        <p>Matched Routes: {JSON.stringify(matches)}</p>
        <p></p>
      </div>
      <Outlet />
    </div>
  )
}
