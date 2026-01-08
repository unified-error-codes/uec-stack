import { useLocation } from 'react-router'
import type { Route } from './+types/sessions'
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
