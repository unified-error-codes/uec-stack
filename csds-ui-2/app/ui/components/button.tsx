type ButtonProps = {
  color: keyof typeof colors
  children: React.ReactNode
}

const colors = {
  black: 'bg-black text-white',
  blue: 'bg-blue-500 text-white',
  white: 'bg-white text-black',
}

export function Button({ color, children }: ButtonProps) {
  return (
    <button
      className={`${colors[color]} rounded-md px-4 py-2 font-sans text-sm/6 font-medium shadow`}
    >
      {children}
    </button>
  )
}
