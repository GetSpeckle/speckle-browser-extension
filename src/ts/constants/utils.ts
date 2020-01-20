export const parseTimeLeft = (timeleft) => {
  if (timeleft === 301) return '05:00'
  timeleft -= 1
  const minutesLeft = parseInt(`${timeleft / 60}`, 10)
  const secondsLeft = (timeleft % 60).toString()
  return `0${minutesLeft}:${ secondsLeft.length === 1 ? `0${secondsLeft}` : secondsLeft}`
}
