import { NavigationDrawer } from '../navigation-drawer'
import { MainContent } from './content'

export const TwoColumnsFrame = () => {
  return (
    <div className={`grid grid-cols-[var(--container-3xs)_1fr] *:px-4 *:py-2`}>
      <NavigationDrawer />
      <MainContent />
    </div>
  )
}
