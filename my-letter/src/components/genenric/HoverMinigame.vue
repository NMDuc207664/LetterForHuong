<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { t } from '../utils/i18n'

const props = defineProps<{
  active: boolean
}>()

type Bubble = {
  id: number
  left: number
  duration: number
  emoji: string
}

const EMOJIS = ['🌸', '✨', '💌', '🌙', '⭐', '🎈']
const SPAWN_INTERVAL_MS = 650

const bubbles = ref<Bubble[]>([])
const score = ref(0)
let spawnTimer: number | undefined
let nextId = 0

const spawnBubble = () => {
  bubbles.value.push({
    id: nextId++,
    left: Math.random() * 92,
    duration: 5 + Math.random() * 4,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
  })
}

const popBubble = (id: number) => {
  bubbles.value = bubbles.value.filter(bubble => bubble.id !== id)
  score.value++
}

const removeBubble = (id: number) => {
  bubbles.value = bubbles.value.filter(bubble => bubble.id !== id)
}

const startSpawning = () => {
  if (spawnTimer !== undefined) return
  spawnTimer = window.setInterval(spawnBubble, SPAWN_INTERVAL_MS)
}

const stopSpawning = () => {
  if (spawnTimer !== undefined) {
    window.clearInterval(spawnTimer)
    spawnTimer = undefined
  }
  bubbles.value = []
}

// Hover ra ngoài khu vực chính -> bật minigame; hover vào trong -> tắt và dọn sạch.
watch(
  () => props.active,
  isActive => (isActive ? startSpawning() : stopSpawning()),
  { immediate: true },
)

onBeforeUnmount(stopSpawning)
</script>

<template>
  <Transition name="minigame-fade">
    <div
      v-if="active"
      class="minigame-layer"
    >
      <p class="minigame-score">{{ t('vie', 'minigame_score') }}: {{ score }}</p>

      <button
        v-for="bubble in bubbles"
        :key="bubble.id"
        type="button"
        class="minigame-bubble"
        :style="{ left: `${bubble.left}%`, animationDuration: `${bubble.duration}s` }"
        @click="popBubble(bubble.id)"
        @animationend="removeBubble(bubble.id)"
      >
        {{ bubble.emoji }}
      </button>
    </div>
  </Transition>
</template>

<style scoped src="../../assets/css/minigame.css"></style>
