import { Radio, RadioGroup } from '@base-ui/react'
import React from 'react'
import { Outlet } from 'react-router'

export default function Layout() {
  const [displayedLayout, setLayout] = React.useState(1)

  return (
    <div className={`grid h-screen grid-rows-[40px_1fr] content-start`}>
      <LayoutSwitch setChecked={setLayout} />
      <div>
        <Outlet />
      </div>
    </div>
  )
}

// layout switch is for dev purposes only
const LayoutSwitch = ({ setChecked }: any) => {
  return (
    <RadioGroup
      defaultValue='2-Columns'
      className='m-auto flex w-full flex-row items-center justify-center gap-2 text-gray-900 shadow-md *:px-4 *:py-2'
    >
      <div className='font-medium'>Layout mode:</div>
      <label
        className='flex items-center gap-2'
        onChange={(e) => {
          // console.log('change event', { e, checked: e.target.checked })
          setChecked(0)
        }}
      >
        <Radio.Root
          value='3-Rows'
          className='flex size-5 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 data-checked:bg-gray-900 data-unchecked:border data-unchecked:border-gray-300'
        >
          <Radio.Indicator className='flex before:size-2 before:rounded-full before:bg-gray-50 data-unchecked:hidden' />
        </Radio.Root>
        3 Rows
      </label>
      <label
        className='flex items-center gap-2'
        onChange={(e) => {
          // console.log('change event', { e, checked: e.target.checked })
          setChecked(1)
        }}
      >
        <Radio.Root
          value='2-Columns'
          className='flex size-5 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 data-checked:bg-gray-900 data-unchecked:border data-unchecked:border-gray-300'
        >
          <Radio.Indicator className='flex before:size-2 before:rounded-full before:bg-gray-50 data-unchecked:hidden' />
        </Radio.Root>
        2 Columns
      </label>
    </RadioGroup>
  )
}
