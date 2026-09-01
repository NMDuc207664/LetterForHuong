import { computed, nextTick, ref } from 'vue'

/**
 * Splits a long content string into pages that each fit within `getMaxHeight()` pixels,
 * using a hidden DOM element for height measurement.
 *
 * @param getContent    - Reactive getter for the raw content (double-newline separated paragraphs).
 * @param getMeasureEl  - Getter for the hidden measurement `<div>` in the DOM.
 * @param getMaxHeight  - Getter for the maximum allowed height per page (in px).
 */
export const useAutoPagination = (
  getContent: () => string | undefined,
  getMeasureEl: () => HTMLElement | null,
  getMaxHeight: () => number,
) => {
  const autoPages = ref<string[]>([])

  const paragraphs = computed(() =>
    (getContent() ?? '')
      .split(/\n\s*\n/g)
      .map(p => p.trim())
      .filter(Boolean)
  )

  /** Returns true if the candidate paragraphs fit within the max height. */
  const fits = (el: HTMLElement, candidates: string[]): boolean => {
    el.innerHTML = candidates
      .map(p => `<p>${p.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`)
      .join('')
    return el.scrollHeight <= getMaxHeight()
  }

  /**
   * Re-splits the content into pages.
   * Should be called on mount and whenever content or max-height changes.
   */
  const rebuild = async () => {
    const el = getMeasureEl()

    if (!getContent() || paragraphs.value.length === 0 || !el) {
      autoPages.value = []
      return
    }

    await nextTick()

    const pages: string[] = []
    let chunk: string[] = []

    for (const paragraph of paragraphs.value) {
      const candidate = [...chunk, paragraph]

      if (chunk.length === 0 || fits(el, candidate)) {
        chunk = candidate
        continue
      }

      pages.push(chunk.join('\n\n'))
      chunk = [paragraph]
    }

    if (chunk.length > 0) {
      pages.push(chunk.join('\n\n'))
    }

    autoPages.value = pages
  }

  return { autoPages, rebuild }
}
