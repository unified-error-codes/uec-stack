import { MainHeader } from '../header/header'
import { MainFooter } from '../footer'
import { Outlet } from 'react-router'

// inline styles according to https://tailwindcss.com/docs/styling-with-utility-classes#when-to-use-inline-styles
const threeRowsGrid = {
  gridTemplateRows: `calc(var(--spacing) * 16) 1fr calc(var(--spacing) * 16)`,
}

export const ThreeRowsFrame = () => {
  return (
    <div style={threeRowsGrid} className='grid *:px-4 *:py-2'>
      <MainHeader />
      <Outlet />
      <MainFooter />
    </div>
  )
}
