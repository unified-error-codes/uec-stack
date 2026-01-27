import { Card } from '~/ui/molecules/card'
import { Button } from '@base-ui/react/button'
import type { SessionDataType } from '.'
import { Stat } from '~/ui/molecules/stat'
import { NavLink } from 'react-router'

export const SessionListItem: React.FC<Partial<SessionDataType>> = ({
  sessionId,
  startTimestamp,
  endTimestamp,
  chargePointId,
  connectorId,
  errorCode,
}) => {
  return (
    <Card className='flex h-16 w-full items-center justify-between outline-1 -outline-offset-1 outline-gray-200'>
      <Stat label={`Session Id`} value={sessionId} />
      <Stat label={'Error code'} value={errorCode} />
      <NavLink
        to={`/sessions/${sessionId}`}
        state={{
          sessionId,
          startTimestamp,
          endTimestamp,
          chargePointId,
          connectorId,
          errorCode,
        }}
      >
        <Button
          className={`font-inherit m-0 flex h-10 items-center justify-center rounded-md border border-gray-200 bg-blue-100 px-3.5 text-base leading-6 font-medium text-gray-900 outline-0 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:border-t-gray-300 active:bg-gray-200 active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] data-disabled:text-gray-500 hover:data-disabled:bg-gray-50 active:data-disabled:border-t-gray-200 active:data-disabled:bg-gray-50 active:data-disabled:shadow-none`}
        >
          Session Details
        </Button>
      </NavLink>
    </Card>
  )
}
