import React from 'react'
import { NavLinkItem } from './nav-items'
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
  const [selected, setSelected] = React.useState(0)

  return (
    <NavigationMenu.Root className={''}>
      <NavigationMenu.List className={`${directionStyles[direction]}`}>
        <NavLinkItem
          to='/'
          label='Home'
          isSelected={selected == 0}
          clickHandler={() => setSelected(0)}
        />
        <NavLinkItem
          to='/charger-unit'
          label='Charger Unit'
          isSelected={selected == 1}
          clickHandler={() => setSelected(1)}
        />
        <NavLinkItem
          to='/sessions'
          label='Sessions'
          isSelected={selected == 2}
          clickHandler={() => setSelected(2)}
        />
      </NavigationMenu.List>
    </NavigationMenu.Root>
  )
}
