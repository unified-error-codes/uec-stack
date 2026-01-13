import HorizontalLogo from '../../assets/horizontal-logo.png'

export const MainHeader = () => {
  return (
    <div className='grid aspect-auto h-16 grid-cols-2 content-center items-center gap-4 px-4 py-2 shadow-md'>
      <img src={HorizontalLogo} />
      <div className='b color h-12 w-12 content-center items-center justify-self-end-safe rounded-full bg-gray-400'>
        <div className='text-center text-white'>EU</div>
      </div>
    </div>
  )
}
