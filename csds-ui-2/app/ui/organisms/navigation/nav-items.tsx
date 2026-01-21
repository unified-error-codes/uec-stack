import {
  NavigationMenu,
  type NavigationMenuLinkProps,
  type NavigationMenuItemProps,
} from '@base-ui/react'
import { NavLink, type NavLinkProps } from 'react-router'
import { Button } from '@base-ui/react/button'

export interface NavLinkItemProps extends NavLinkProps {
  label: string
  NavigationMenuLinkProps?: NavigationMenuLinkProps
  isSelected: boolean
  clickHandler: () => void
}
export const NavLinkItem: React.FC<NavLinkItemProps> = ({
  to,
  label,
  NavigationMenuLinkProps,
  isSelected,
  clickHandler,
  ...rest
}) => {
  const selectedStyles =
    isSelected ? 'bg-yellow-200 hover:bg-yellow-200 hover:outline-' : ''
  return (
    <NavItem>
      <NavigationMenu.Link
        render={
          <NavLink
            to={to}
            className={`hover:bg-yellow-100 focus:bg-yellow-400 active:bg-yellow-300 ${selectedStyles} outline-red-400`}
            {...rest}
          >
            <Button
              className={'w-full'}
              onClick={clickHandler}
              aria-label={label}
            >
              {label}
            </Button>
          </NavLink>
        }
        {...NavigationMenuLinkProps}
      />
    </NavItem>
  )
}

export const NavItem: React.FC<NavigationMenuItemProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    //   renders <li/>
    <NavigationMenu.Item
      className={`grid h-8 items-center text-center ${className}`}
      {...rest}
    >
      {children}
    </NavigationMenu.Item>
  )
}
