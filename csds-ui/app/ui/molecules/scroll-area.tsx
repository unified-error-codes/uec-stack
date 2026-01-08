import { ScrollArea } from '@base-ui/react/scroll-area'

type ScrollableProps = {
  children: React.ReactNode
}

export const Scrollable: React.FC<ScrollableProps> = ({ children }) => {
  return (
    <ScrollArea.Root
      data-at='scroll-root'
      className='box-border h-full rounded-lg'
    >
      <ScrollArea.Viewport
        data-at='scroll-viewport'
        className="h-full rounded-md before:pointer-events-none before:absolute before:top-0 before:left-0 before:block before:h-[min(40px,var(--scroll-area-overflow-y-start))] before:w-full before:rounded-md before:bg-[linear-gradient(to_bottom,var(--color-gray-50),transparent)] before:transition-[height] before:duration-100 before:ease-out before:content-[''] before:[--scroll-area-overflow-y-start:inherit] after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:block after:h-[min(40px,var(--scroll-area-overflow-y-end,40px))] after:w-full after:rounded-md after:bg-[linear-gradient(to_top,var(--color-gray-50),transparent)] after:transition-[height] after:duration-100 after:ease-out after:content-[''] after:[--scroll-area-overflow-y-end:inherit] focus-visible:outline focus-visible:outline-blue-800"
      >
        <ScrollArea.Content
          data-at='scroll-content'
          className='flex flex-col gap-4 pr-2 pl-2'
        >
          {children}
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        data-at='scroll-scrollbar'
        className="pointer-events-none ml-2 flex w-1 justify-center rounded bg-gray-200 opacity-0 transition-opacity duration-150 before:absolute before:h-full before:w-5 before:content-[''] data-hovering:pointer-events-auto data-hovering:opacity-100 data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0 data-[hovering=true]:pointer-events-auto data-[hovering=true]:opacity-100 data-[scrolling=true]:pointer-events-auto data-[scrolling=true]:opacity-100 data-[scrolling=true]:duration-0"
      >
        <ScrollArea.Thumb
          data-at='scroll-thumb'
          className='w-full rounded bg-gray-500'
        />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}
