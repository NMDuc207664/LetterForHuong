let audioContext = null

const getAudioContext = async () => {
  if (typeof window === 'undefined') return null

  const AudioCtor = window.AudioContext || window.webkitAudioContext
  if (!AudioCtor) return null

  if (!audioContext) {
    audioContext = new AudioCtor()
  }

  if (audioContext.state === 'suspended') {
    await audioContext.resume()
  }

  return audioContext
}

export const playTypingSound = async () => {
  const context = await getAudioContext()
  if (!context) return

  const oscillator = context.createOscillator()
  const gainNode = context.createGain()
  const now = context.currentTime

  oscillator.type = 'square'
  oscillator.frequency.setValueAtTime(880, now)
  gainNode.gain.setValueAtTime(0.0001, now)
  gainNode.gain.exponentialRampToValueAtTime(0.025, now + 0.01)
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.06)

  oscillator.connect(gainNode)
  gainNode.connect(context.destination)
  oscillator.start(now)
  oscillator.stop(now + 0.07)
}

export const closeTypingSound = async () => {
  if (!audioContext) return

  await audioContext.close()
  audioContext = null
}
