import { Links, Meta, Scripts, ScrollRestoration } from 'react-router'

export const DocumentTemplate = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
