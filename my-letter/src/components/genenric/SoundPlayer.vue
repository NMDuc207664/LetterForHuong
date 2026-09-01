<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { t } from '../utils/i18n'

// Tự động lấy mọi file âm thanh trong assets/sounds, thêm file mới vào là có luôn, không cần sửa code.
const soundModules = import.meta.glob('../../assets/sounds/*.{mp3,ogg,wav,m4a}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

type Track = {
  name: string
  src: string
}

defineProps({
  listOn: {
    type: Boolean,
    default: false,
  },
})

const tracks: Track[] = Object.entries(soundModules)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .map(([path, src]) => ({
    name: (path.split('/').pop() ?? path).replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
    src,
  }))

const audio = new Audio()
const isOn = ref(false)
const isExpanded = ref(false)
const currentIndex = ref(0)
const intervalSeconds = ref(3)
let restartTimer: number | undefined

const currentTrack = computed(() => tracks[currentIndex.value])

const clearRestartTimer = () => {
  if (restartTimer !== undefined) {
    window.clearTimeout(restartTimer)
    restartTimer = undefined
  }
}

const playCurrent = () => {
  if (!currentTrack.value) return
  audio.src = currentTrack.value.src
  audio.currentTime = 0

  // Trình duyệt có thể chặn autoplay khi chưa có tương tác nào của người dùng ->
  // thử lại ngay khi người dùng tương tác lần đầu (click/chạm/phím bất kỳ).
  audio.play().catch(() => {
    document.addEventListener('pointerdown', playCurrent, { once: true })
    document.addEventListener('keydown', playCurrent, { once: true })
  })
}

// Bài hát kết thúc -> chờ đúng khoảng cách đã đặt rồi phát bài tiếp theo
// (hoặc phát lại chính bài đó nếu playlist chỉ có 1 bài).
const scheduleNext = () => {
  clearRestartTimer()
  restartTimer = window.setTimeout(() => {
    if (!isOn.value) return
    if (tracks.length > 1) {
      currentIndex.value = (currentIndex.value + 1) % tracks.length
    }
    playCurrent()
  }, Math.max(0, intervalSeconds.value) * 1000)
}

audio.addEventListener('ended', () => {
  if (isOn.value) scheduleNext()
})

const togglePower = () => {
  if (!tracks.length) return

  isOn.value = !isOn.value
  if (isOn.value) {
    playCurrent()
  } else {
    clearRestartTimer()
    audio.pause()
  }
}

const selectTrack = (index: number) => {
  currentIndex.value = index
  if (isOn.value) playCurrent()
}

const prevTrack = () => {
  if (tracks.length < 2) return
  selectTrack((currentIndex.value - 1 + tracks.length) % tracks.length)
}

const nextTrack = () => {
  if (tracks.length < 2) return
  selectTrack((currentIndex.value + 1) % tracks.length)
}

// Có nhiều hơn 1 bài trong danh sách -> tự bật nhạc ngay khi trang load xong.
onMounted(() => {
  if (tracks.length > 1) togglePower()
})

onBeforeUnmount(() => {
  clearRestartTimer()
  audio.pause()
})

</script>

<template>
  <div
    class="sound-player"
    :class="{ 'is-expanded': isExpanded }"
  >
    <div class="sound-controls">
      <button
        type="button"
        class="sound-toggle"
        :class="{ 'is-on': isOn }"
        :disabled="!tracks.length"
        :aria-label="isOn ? t('vie', 'sound_off') : t('vie', 'sound_on')"
        @click="togglePower"
      >
        {{ isOn ? '🔊' : '🔇' }}
      </button>

      <button
        v-if="tracks.length && listOn"
        type="button"
        class="sound-expand"
        @click="isExpanded = !isExpanded"
      >
        {{ t('vie', 'sound_playlist') }}
      </button>

      <template v-if="tracks.length > 1 && !listOn">
        <button
          type="button"
          class="sound-arrow"
          :aria-label="t('vie', 'sound_prev')"
          @click="prevTrack"
        >
          ‹
        </button>
        <button
          type="button"
          class="sound-arrow"
          :aria-label="t('vie', 'sound_next')"
          @click="nextTrack"
        >
          ›
        </button>
      </template>
    </div>

    <p
      v-if="!tracks.length"
      class="sound-empty"
    >
      {{ t('vie', 'sound_empty') }}
    </p>

    <div
      v-else-if="isExpanded && listOn"
      class="sound-panel"
    >
      <ul class="sound-tracklist">
        <li
          v-for="(track, index) in tracks"
          :key="track.src"
          class="sound-track"
          :class="{ active: index === currentIndex }"
          @click="selectTrack(index)"
        >
          {{ track.name }}
        </li>
      </ul>

      <label class="sound-interval">
        {{ t('vie', 'sound_interval_label') }}
        <input
          v-model.number="intervalSeconds"
          type="number"
          min="0"
          step="1"
        />
        {{ t('vie', 'sound_interval_unit') }}
      </label>
    </div>
  </div>
</template>

<style scoped src="../../assets/css/soundplayer.css"></style>
