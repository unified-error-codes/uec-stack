const shadowTop =
  'shadow-[0px_-4px_6px_-1px_rgba(0,0,0,0.1),0px_-2px_4px_-2px_rgba(0,0,0,0.1)]'

export const MainFooter = () => {
  return (
    <footer className={`${shadowTop} grid grid-cols-1`}>
      <div className='content-center items-center justify-self-end-safe text-right'>
        &copy; Kano Software 2026
      </div>
    </footer>
  )
}
