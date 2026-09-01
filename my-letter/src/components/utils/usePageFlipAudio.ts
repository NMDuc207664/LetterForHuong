/**
 * Synthesises a short page-flip sound using the Web Audio API.
 * The AudioContext is created lazily on the first call and reused afterwards.
 */
export const usePageFlipAudio = () => {
  let audioContext: AudioContext | null = null

  /** Plays the page-flip sound. Safe to call in any browser environment. */
  const play = () => {
    if (typeof window === 'undefined') return

    const ContextCtor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

    if (!ContextCtor) return

    if (!audioContext) {
      audioContext = new ContextCtor()
    }

    if (audioContext.state === 'suspended') {
      void audioContext.resume()
    }

    const now = audioContext.currentTime
    const gain = audioContext.createGain()
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.04, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16)
    gain.connect(audioContext.destination)

    const osc = audioContext.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(420, now)
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.16)
    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.16)
  }

  return { play }
}
