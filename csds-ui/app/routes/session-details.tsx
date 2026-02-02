import { useLocation } from 'react-router'
import type { Route } from './+types/session-details'
import { SessionDetailsContent } from '~/ui/templates/outlets/session-details'

interface SessionDetails extends Route.ComponentProps {
  params: {
    sessionId: string
  }
}

export default function SessionDetails() {
  const navLinkState = useLocation()

  return <SessionDetailsContent {...navLinkState.state} />
}
