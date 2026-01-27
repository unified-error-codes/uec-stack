import { Stat } from '~/ui/molecules/stat'
import { sessionListData } from 'mock-data/sessions'

export const HomeContent: React.FC<{}> = () => {
  return (
    <section className={`grid h-full grid-rows-2 gap-4`}>
      <div className={`text-4xl font-semibold tracking-wider`}>
        Diagnostics Home
      </div>
      <Stat label={`Available sessions`} value={sessionListData.length} />
    </section>
  )
}
