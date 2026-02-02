import { Stat } from '~/ui/molecules/stat'

type SessionsHeaderType = {
  sessionsLength: number | string
}

export const SessionsHeader: React.FC<SessionsHeaderType> = ({
  sessionsLength,
}) => {
  return (
    <section className={`grid h-full grid-rows-2 gap-4`}>
      <div className={`text-4xl font-semibold tracking-wider`}>
        Sessions List
      </div>
      <Stat label={`Available sessions`} value={sessionsLength} />
    </section>
  )
}
