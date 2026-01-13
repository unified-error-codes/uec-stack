import { MainHeader } from './header'
import { MainFooter } from './footer'

export const PageFrame = () => {
  return (
    <div className='grid h-full grid-rows-3'>
      <MainHeader />
      <div>content</div>
      <MainFooter />
    </div>
  )
}
