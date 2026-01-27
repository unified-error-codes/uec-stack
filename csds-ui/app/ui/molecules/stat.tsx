type StatProps = {
  value?: string | number
  label: string
} & React.ComponentProps<'div'>
export const Stat: React.FC<StatProps> = ({ value, label, className = '' }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className={`text-sm font-light text-gray-500`}>{label}</div>
      <div className={`text-xl font-medium tracking-wider tabular-nums`}>
        {value}
      </div>
    </div>
  )
}
