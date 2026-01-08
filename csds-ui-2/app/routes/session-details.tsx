import type { Route } from './+types/sessions'

export async function loader({ params }: Route.LoaderArgs) {
  //                           ^? { teamId: string }
}

interface SessionDetails extends Route.ComponentProps {
  params: {
    sessionId: string
  }
}

export default function SessionDetails({ params }: SessionDetails) {
  const { sessionId } = params

  return <div>{sessionId}</div>
}
