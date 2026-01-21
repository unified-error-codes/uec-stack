import { Outlet } from 'react-router'
export const MainContent = () => {
  return (
    <main className={`mainContent`}>
      <Outlet />
    </main>
  )
}
