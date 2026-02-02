import * as React from 'react'

export const Card: React.FC<React.ComponentProps<'div'>> = ({
  children,
  className,
}) => {
  return (
    <div
      className={`mx-auto rounded-xl bg-white p-4 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10 ${className}`}
    >
      {children}
    </div>
  )
}
