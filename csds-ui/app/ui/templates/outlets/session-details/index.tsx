import { Separator } from '@base-ui/react'
import { Stat } from '~/ui/molecules/stat'
import { DetailsHeader } from './header'
import type { SessionDataType } from '../sessions'

export const SessionDetailsContent: React.FC<SessionDataType> = ({
  sessionId,
  errorCode,
  startTimestamp,
  endTimestamp,
  chargePointId,
  connectorId,
}) => {
  const dates = { start: new Date(startTimestamp), end: new Date(endTimestamp) }
  const duration = new Date(endTimestamp - startTimestamp)
  // when you subtract timestamps the result is always +1 hour for some reason - probably because time zone offset. anyways it would be better to have it calculated on backend
  duration.setHours(duration.getHours() - 1)
  return (
    <>
      <DetailsHeader {...{ sessionId, errorCode, duration }} />
      <Separator className={`h-px bg-gray-300`} />
      <div>
        <section className={`grid-flow-cols grid grid-cols-2 gap-2`}>
          <DetailsSectionHeading>Unit data</DetailsSectionHeading>
          <Stat label={'Charge Point Id'} value={chargePointId} />
          <Stat label={'Connector Id'} value={connectorId} />
          <Separator className={`col-span-2 h-px bg-gray-300`} />
          <DetailsSectionHeading>Session Timeline</DetailsSectionHeading>
          <Stat label={'Start date'} value={dates.start.toDateString()} />
          <Stat label={'End date'} value={dates.end.toDateString()} />
          <Stat
            label={'Start time'}
            value={dates.start.toTimeString().slice(0, 8)}
          />
          <Stat
            label={'End time'}
            value={dates.end.toTimeString().slice(0, 8)}
          />
          <Stat
            className={'col-span-2'}
            label={'Time Zone'}
            value={dates.end.toTimeString().slice(8)}
          />
          <Separator className={`col-span-2 h-px bg-gray-300`} />
          <DetailsSectionHeading>Session Timestamps</DetailsSectionHeading>
          <Stat label={'Start'} value={startTimestamp} />
          <Stat label={'End'} value={endTimestamp} />
        </section>
      </div>
    </>
  )
}

export const DetailsSectionHeading: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div
      className={`col-span-2 bg-linear-to-r from-blue-100 to-white text-2xl font-medium tracking-wider`}
    >
      {children}
    </div>
  )
}
