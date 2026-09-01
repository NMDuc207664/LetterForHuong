export const createTypingEffect = ({
  getText,
  isActive,
  onCharacter,
  onComplete,
  delay = 350,
  step = 80,
}) => {
  let timerId = null

  const resolveValue = (value) => typeof value === 'function' ? value() : value

  const clear = () => {
    if (timerId !== null) {
      window.clearTimeout(timerId)
      timerId = null
    }
  }

  const start = () => {
    clear()

    const text = getText()
    if (!isActive() || !text) {
      onCharacter('')
      return
    }

    const startDelay = resolveValue(delay)
    const stepDelay = resolveValue(step)

    let index = 0
    onCharacter('')

    const typeNext = () => {
      if (!isActive()) {
        timerId = null
        return
      }

      index += 1
      onCharacter(text.slice(0, index))

      if (index < text.length) {
        timerId = window.setTimeout(typeNext, stepDelay)
        return
      }

      timerId = null
      if (onComplete) {
        onComplete()
      }
    }

    timerId = window.setTimeout(typeNext, startDelay)
  }

  return {
    start,
    clear,
  }
}
