import HorizontalLogo from '~/assets/horizontal-logo.png'
import { MainNavigation } from '~/ui/organisms/navigation/'

type MainHeaderProps = {
  className?: string | undefined
}

export const MainHeader = ({ className }: MainHeaderProps) => {
  const order = 'left'
  return (
    <header
      className={`flex flex-row items-center justify-between gap-4 shadow-md ${className} `}
    >
      <img className={`h-12`} src={HorizontalLogo} />
      <MainNavigation direction='horizontal' />
    </header>
  )
}
