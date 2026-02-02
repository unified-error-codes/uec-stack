export const getRandomNumberInRange: (min: number, max: number) => number = (
  min,
  max
) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// generates dates from arbitrary period with arbitrary duration
export const generateDate = () => {
  const year = 2026
  const monthIndex = 0
  const dayIndex = getRandomNumberInRange(10, 26)
  const hourIndex = getRandomNumberInRange(0, 23)
  const minutesIndex = getRandomNumberInRange(0, 59)
  const secondsIndex = getRandomNumberInRange(0, 59)

  const startDate = new Date(
    year,
    monthIndex,
    dayIndex,
    hourIndex,
    minutesIndex,
    secondsIndex
  )
  const durationHours = getRandomNumberInRange(0, 4)
  const durationMinutes = getRandomNumberInRange(0, 59)
  const durationSeconds = getRandomNumberInRange(0, 59)
  const endDate = new Date(
    year,
    monthIndex,
    dayIndex,
    hourIndex + durationHours,
    minutesIndex + durationMinutes,
    secondsIndex + durationSeconds
  )
  return {
    startDate,
    endDate,
  }
}
