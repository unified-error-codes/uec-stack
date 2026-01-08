import { Separator } from '@base-ui/react/separator'
import { Scrollable } from '../../../molecules/scroll-area'
import { SessionListItem } from './session-item'
import { SessionsHeader } from './sessions-header'
import { sessionListData } from 'mock-data/sessions'

export const SessionsContent: React.FC<Partial<SessionDataType>> = () => {
  return (
    <>
      <SessionsHeader sessionsLength={sessionListData.length} />
      <Separator className={`h-px bg-gray-300`} />
      <section className='h-full overflow-auto'>
        <Scrollable>
          {sessionListData.map((data, i) => (
            <SessionListItem key={i} {...data} />
          ))}
        </Scrollable>
      </section>
    </>
  )
}

export type SessionDataType = {
  sessionId: number
  startTimestamp: number
  endTimestamp: number
  chargePointId: number
  connectorId: number
  errorCode: number
}
