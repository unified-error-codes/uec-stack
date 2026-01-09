import * as React from 'react'
import { NavLink } from 'react-router'

export function MainNavigation() {
  return (
    <nav style={{ margin: '16px auto' }}>
      <NavLinkItem label={'Home'} target={'/'} style={{ marginRight: '8px' }} />
      <NavLinkItem
        label={'Sessions'}
        target={'/sessions'}
        style={{ marginRight: '8px' }}
      />
      <NavLinkItem label={'Session 1234'} target={'/sessions/1234'} />
    </nav>
  )
}

interface NavLinkItemProps extends React.ComponentProps<'a'> {
  label: string
  target: string
}
export const NavLinkItem = (props: NavLinkItemProps) => {
  const { label, target } = props
  return (
    <NavLink
      to={target}
      end
      style={{
        padding: '8px 16px',
        border: '1px solid lightblue',
        backgroundColor: 'lightblue',
        ...props.style,
      }}
    >
      {label}
    </NavLink>
  )
}
