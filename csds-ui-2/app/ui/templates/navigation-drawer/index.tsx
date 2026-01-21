import HorizontalLogo from '~/assets/horizontal-logo.png'
import { Separator } from '@base-ui/react/separator'
import { MainNavigation } from '~/ui/organisms/navigation/'

const TwoRowsGrid = {
  gridTemplateRows: `1fr calc(var(--spacing) * 16)`,
}

export const NavigationDrawer = () => {
  return (
    <section className={`grid shadow-md`} style={TwoRowsGrid}>
      <section className={``}>
        <div className={`flex h-12 items-center justify-center`}>
          <img className={`aspect-326/61`} src={HorizontalLogo} />
        </div>
        <Separator
          orientation='horizontal'
          className={`my-2 h-px bg-gray-300`}
        />
        <MainNavigation direction='vertical' />
      </section>
      <footer className={`grid grid-rows-[auto_1fr]`}>
        <Separator
          orientation='horizontal'
          className={`my-2 h-px bg-gray-300`}
        />
        <div className='content-center items-center justify-self-start'>
          &copy; Kano Software 2026
        </div>
      </footer>
    </section>
  )
}
