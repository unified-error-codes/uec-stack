import { Button } from '@base-ui/react'
import { NavLink } from 'react-router'
import { Stat } from '~/ui/molecules/stat'
import { ArrowLeftIcon } from '~/ui/molecules/icons'
import type { SessionDataType } from '../sessions'

type DetailsHeaderProps = Pick<SessionDataType, 'sessionId' | 'errorCode'> & {
  duration: Date
}

export const DetailsHeader: React.FC<DetailsHeaderProps> = ({
  sessionId,
  errorCode,
  duration,
}) => {
  return (
    <section className='grid grid-rows-2 gap-2'>
      <div className={`grid grid-cols-[auto_auto] justify-between`}>
        <div className={`text-4xl font-semibold tracking-wider`}>
          Session Details
        </div>
        <NavLink to={`/sessions`} className={``}>
          <Button
            className={`font-inherit m-0 flex h-10 items-center justify-center rounded-md border border-gray-200 bg-blue-100 px-3.5 text-base leading-6 font-medium text-gray-900 outline-0 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:border-t-gray-300 active:bg-gray-200 active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] data-disabled:text-gray-500 hover:data-disabled:bg-gray-50 active:data-disabled:border-t-gray-200 active:data-disabled:bg-gray-50 active:data-disabled:shadow-none`}
          >
            <ArrowLeftIcon className={`mr-2 size-4`} />
            Back to sessions list
          </Button>
        </NavLink>
      </div>

      <div className='grid grid-cols-3 justify-between gap-4'>
        <Stat label={`Session Id`} value={sessionId} />
        <Stat label={'Error code'} value={errorCode} />
        <Stat
          label={'Session duration calculated'}
          value={`${duration.toTimeString().slice(0, 8)}`}
        />
      </div>
    </section>
  )
}
