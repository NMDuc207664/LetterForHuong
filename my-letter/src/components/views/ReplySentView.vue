<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '../utils/i18n'
import { REPLY_CONTENT_STORAGE_KEY } from '../constants/replyStorage'
import SoundPlayer from './../genenric/SoundPlayer.vue'

const router = useRouter()
const savedContent = ref('')

onMounted(() => {
  const stored = sessionStorage.getItem(REPLY_CONTENT_STORAGE_KEY)

  // Không có thư nào đã gửi trong phiên này → quay lại trang hồi đáp.
  if (!stored) {
    router.replace({ name: 'reply' })
    return
  }

  savedContent.value = stored
})

const writeAnother = () => router.push({ name: 'reply' })
const goHome = () => router.push({ name: 'home' })
</script>

<template>
    <SoundPlayer />
  <main class="reply-page">

    <div class="reply-background"></div>

    <article class="reply-paper">

      <header class="reply-header">
        <div>
          <h1>{{ t('vie', 'reply_sent_title') }}</h1>
          <p>{{ t('vie', 'reply_sent_description') }}</p>
        </div>
      </header>

      <div
        class="editor-wrapper reply-sent-content"
        v-html="savedContent"
      ></div>

      <footer class="reply-footer">
        <button
          class="send-button"
          type="button"
          @click="writeAnother"
        >
          {{ t('vie', 'write_another_reply') }}
        </button>

        <button
          class="home-link-button"
          type="button"
          @click="goHome"
        >
          {{ t('vie', 'home_button') }}
        </button>
      </footer>

    </article>

  </main>
</template>

<style scoped src="../../assets/css/replyview.css"></style>
