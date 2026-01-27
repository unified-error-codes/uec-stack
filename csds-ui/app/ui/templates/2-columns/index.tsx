import { NavigationDrawer } from '../navigation-drawer'
import { MainContent } from '../content'

export const TwoColumnsFrame = () => {
  return (
    <div className={`grid h-screen grid-cols-[var(--container-3xs)_1fr] *:p-4`}>
      <NavigationDrawer />
      <MainContent />
    </div>
  )
}
