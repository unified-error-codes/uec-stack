import React from 'react'
import { NavLinkItem } from '../../molecules/nav-items'
import { NavigationMenu } from '@base-ui/react'

type MainNavigationProps = React.ComponentProps<'nav'> & {
  direction: 'vertical' | 'horizontal'
}

const directionStyles = {
  horizontal: 'grid grid-cols-3 gap-4 *:w-24',
  vertical: '',
}

export const MainNavigation: React.FC<MainNavigationProps> = ({
  direction,
}) => {
  return (
    <NavigationMenu.Root>
      <NavigationMenu.List className={`${directionStyles[direction]}`}>
        <NavLinkItem to='/' matchPattern='/' label='Home' />
        <NavLinkItem
          to='/sessions'
          matchPattern='/sessions/*'
          label='Sessions'
        />
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}
