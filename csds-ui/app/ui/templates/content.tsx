import { Outlet } from 'react-router'
export const MainContent = () => {
  return (
    <main
      className={`grid size-full grid-rows-[15%_auto_1fr] gap-4 overflow-hidden`}
    >
      <Outlet />
    </main>
  )
}
