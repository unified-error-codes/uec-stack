import HorizontalLogo from '~/assets/horizontal-logo.png'
import { Separator } from '@base-ui/react/separator'
import { MainNavigation } from '~/ui/organisms/navigation/'

const TwoRowsGrid = {
  gridTemplateRows: `auto 1fr auto`,
}

export const NavigationDrawer = () => {
  return (
    <section className={`grid shadow-md`} style={TwoRowsGrid}>
      <header>
        <img className={`aspect-326/61`} src={HorizontalLogo} />
        <Separator
          orientation='horizontal'
          className={`my-4 h-px bg-gray-300`}
        />
      </header>
      <MainNavigation direction='vertical' />
      <footer className={``}>
        <Separator
          orientation='horizontal'
          className={`my-4 h-px bg-gray-300`}
        />
        <div className=''>&copy; Kano Software 2026</div>
      </footer>
    </section>
  )
}
