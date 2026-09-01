export type LetterPayload = {
  date: string
  title: string
  content: string
}

/**
 * Parses a tagged letter text file into structured fields.
 *
 * Expected format:
 *   [date]    YYYY-MM-DD
 *   [title]   Tiêu đề bức thư
 *   [content] Nội dung...
 *
 * Sections can appear in any order. Missing sections return an empty string.
 */
export const parseTaggedLetter = (raw: string): LetterPayload => {
  const getSection = (key: 'date' | 'title' | 'content'): string => {
    const regex = new RegExp(
      `\\[${key}\\]\\s*([\\s\\S]*?)(?=\\n\\s*\\[(date|title|content)\\]|$)`,
      'i'
    )
    return raw.match(regex)?.[1]?.trim() ?? ''
  }

  return {
    date:    getSection('date'),
    title:   getSection('title'),
    content: getSection('content'),
  }
}
