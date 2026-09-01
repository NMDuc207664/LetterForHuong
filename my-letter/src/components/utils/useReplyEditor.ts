import { useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { t } from './i18n'

/**
 * Configures the Tiptap editor for the reply page.
 *
 * - Bold, italic, strike, heading (H2), bullet list, ordered list, text alignment.
 * - The editor surface receives a `data-placeholder` attribute so the CSS
 *   `::before` pseudo-element can display it via `attr(data-placeholder)`.
 */
export const useReplyEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    editorProps: {
      attributes: {
        'data-placeholder': t('vie', 'reply_placeholder'),
      },
    },
    content: '<p></p>',
  })

  /** Returns the current editor content as an HTML string. */
  const getHTML = (): string => editor.value?.getHTML() ?? ''

  return { editor, getHTML }
}
