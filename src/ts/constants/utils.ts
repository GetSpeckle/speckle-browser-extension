export const parseTimeLeft = (timeleft) => {
  const minutesLeft = parseInt(`${timeleft / 60}`, 10)
  const secondsLeft = (timeleft % 60).toString()
  return `0${minutesLeft}:${secondsLeft.length === 1 ? `0${secondsLeft}` : secondsLeft}`
}
