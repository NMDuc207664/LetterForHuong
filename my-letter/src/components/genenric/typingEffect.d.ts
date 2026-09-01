export type TypingEffectOptions = {
  getText: () => string
  isActive: () => boolean
  onCharacter: (value: string) => void
  onComplete?: () => void
  delay?: number | (() => number)
  step?: number | (() => number)
}

export type TypingEffectController = {
  start: () => void
  clear: () => void
}

export function createTypingEffect(options: TypingEffectOptions): TypingEffectController
