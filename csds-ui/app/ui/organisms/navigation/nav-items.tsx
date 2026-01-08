import {
  NavigationMenu,
  type NavigationMenuLinkProps,
  type NavigationMenuItemProps,
} from '@base-ui/react'
import { NavLink, useMatch, type NavLinkProps } from 'react-router'
import { Button } from '@base-ui/react/button'
import React from 'react'

export interface NavLinkItemProps extends NavLinkProps {
  label: string
  NavigationMenuLinkProps?: NavigationMenuLinkProps
  matchPattern: string
  clickHandler?: () => void
}
export const NavLinkItem: React.FC<NavLinkItemProps> = ({
  to,
  label,
  NavigationMenuLinkProps,
  matchPattern,
  clickHandler,
  ...rest
}) => {
  const [statefulStyles, setStatefulStyles] = React.useState('')
  const selectedStyles = 'bg-blue-200 hover:bg-blue-200 hover:outline-'

  const pathNameMatch = useMatch(matchPattern)

  React.useEffect(() => {
    if (pathNameMatch && pathNameMatch.pathnameBase == to) {
      setStatefulStyles(selectedStyles)
    } else {
      setStatefulStyles('')
    }
  }, [pathNameMatch])
  return (
    <NavItem>
      <NavigationMenu.Link
        render={
          <NavLink
            to={to}
            className={`size-full hover:bg-blue-100 focus:bg-blue-400 active:bg-blue-300 ${statefulStyles} `}
            {...rest}
          >
            <Button
              className={'size-full cursor-pointer'}
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
