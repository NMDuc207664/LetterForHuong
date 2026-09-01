<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { EditorContent } from '@tiptap/vue-3'
import { t } from '../utils/i18n'
import { useReplyEditor } from '../utils/useReplyEditor'
import { sendLetter as sendReplyApi } from '../api/sendreply'
import { REPLY_CONTENT_STORAGE_KEY } from '../constants/replyStorage'

const { editor, getHTML } = useReplyEditor()
const router = useRouter()

const isSending = ref(false)
const feedbackMessage = ref('')
const isError = ref(false)

const sendReply = async () => {
  isSending.value = true
  feedbackMessage.value = ''

  const html = getHTML()
  const { ok, message, error } = await sendReplyApi(html)

  isSending.value = false
  isError.value = !ok
  feedbackMessage.value = ok ? (message ?? '') : (error ?? '')

  if (ok) {
    sessionStorage.setItem(REPLY_CONTENT_STORAGE_KEY, html)
    router.push({ name: 'reply-sent' })
  }
}
</script>

<template>
  <main class="reply-page">

    <div class="reply-background"></div>

    <article class="reply-paper">

      <!-- HEADER -->

      <header class="reply-header">

        <div>
          <h1>{{ t('vie', 'reply_title') }}</h1>

          <p>
            {{ t('vie', 'reply_description') }}
          </p>
        </div>

      </header>


      <!-- TOOLBAR -->

      <div
        v-if="editor"
        class="toolbar"
      >

        <!-- Text -->

        <button
          type="button"
          :class="{ active: editor.isActive('bold') }"
          @click="editor.chain().focus().toggleBold().run()"
        >
          {{ t('vie', 'editor_bold') }}
        </button>

        <button
          type="button"
          :class="{ active: editor.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          {{ t('vie', 'editor_italic') }}
        </button>

        <button
          type="button"
          :class="{ active: editor.isActive('strike') }"
          @click="editor.chain().focus().toggleStrike().run()"
        >
          {{ t('vie', 'editor_strike') }}
        </button>


        <span class="toolbar-divider"></span>


        <!-- Heading -->

        <button
          type="button"
          :class="{ active: editor.isActive('heading', { level: 2 }) }"
          @click="
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run()
          "
        >
          {{ t('vie', 'editor_heading') }}
        </button>


        <!-- Lists -->

        <button
          type="button"
          :class="{ active: editor.isActive('bulletList') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          "
        >
          {{ t('vie', 'editor_bullet_list') }}
        </button>

        <button
          type="button"
          :class="{ active: editor.isActive('orderedList') }"
          @click="
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          "
        >
          {{ t('vie', 'editor_ordered_list') }}
        </button>


        <span class="toolbar-divider"></span>


        <!-- Alignment -->

        <button
          type="button"
          :class="{
            active: editor.isActive({ textAlign: 'left' })
          }"
          @click="
            editor
              .chain()
              .focus()
              .setTextAlign('left')
              .run()
          "
        >
          {{ t('vie', 'editor_align_left') }}
        </button>

        <button
          type="button"
          :class="{
            active: editor.isActive({ textAlign: 'center' })
          }"
          @click="
            editor
              .chain()
              .focus()
              .setTextAlign('center')
              .run()
          "
        >
          {{ t('vie', 'editor_align_center') }}
        </button>

        <button
          type="button"
          :class="{
            active: editor.isActive({ textAlign: 'right' })
          }"
          @click="
            editor
              .chain()
              .focus()
              .setTextAlign('right')
              .run()
          "
        >
          {{ t('vie', 'editor_align_right') }}
        </button>


        <span class="toolbar-divider"></span>


        <!-- Undo / Redo -->

        <button
          type="button"
          @click="
            editor
              .chain()
              .focus()
              .undo()
              .run()
          "
        >
          {{ t('vie', 'editor_undo') }}
        </button>

        <button
          type="button"
          @click="
            editor
              .chain()
              .focus()
              .redo()
              .run()
          "
        >
          {{ t('vie', 'editor_redo') }}
        </button>

      </div>


      <!-- EDITOR -->

      <div class="editor-wrapper">

        <EditorContent :editor="editor" />

      </div>


      <!-- FOOTER -->

      <footer class="reply-footer">

        <p
          v-if="feedbackMessage"
          class="feedback"
          :class="isError ? 'feedback--error' : 'feedback--success'"
        >
          {{ feedbackMessage }}
        </p>

        <button
          class="send-button"
          type="button"
          :disabled="isSending"
          @click="sendReply"
        >
          {{ isSending ? t('vie', 'sending_reply') : t('vie', 'send_reply') }}
        </button>

      </footer>

    </article>

  </main>
</template>

<style scoped src="../../assets/css/replyview.css"></style>