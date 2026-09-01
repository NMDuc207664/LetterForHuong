<script setup lang="ts">
import { onBeforeUnmount, ref, watch, computed } from 'vue'
import { createTypingEffect } from './typingEffect'
import { closeTypingSound, playTypingSound } from './typingSound'
import { t, type Namespace } from './../utils/i18n'
import { vDraggable } from '../utils/vDraggable'

const emit = defineEmits<{
  confirm: []
  return: []
}>()

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  typingDelay: {
    type: Number,
    default: 350
  },
  typingStep: {
    type: Number,
    default: 80
  }
})

const typedText = ref('')
const isTypingComplete = ref(false)
const currentLang = ref<Namespace>('vie')
let completeTimer: number | null = null

const confirmText = computed(() => t(currentLang.value, 'yes'))
const returnText = computed(() => t(currentLang.value, 'no'))

const clearCompleteTimer = () => {
  if (completeTimer !== null) {
    window.clearTimeout(completeTimer)
    completeTimer = null
  }
}

const handleReturn = () => {
  emit('return')
}

const handleConfirm = () => {
  emit('confirm')
}

const typingEffect = createTypingEffect({
  getText: () => props.text,
  isActive: () => props.isLoading,
  delay: () => props.typingDelay,
  step: () => props.typingStep,
  onCharacter: (value: string) => {
    const isNewCharacter = value.length > typedText.value.length
    typedText.value = value

    if (isNewCharacter) {
      void playTypingSound()
    }
  },
  onComplete: () => {
    clearCompleteTimer()
    completeTimer = window.setTimeout(() => {
      if (props.isLoading) {
        isTypingComplete.value = true
      }
      completeTimer = null
    }, 1000)
  }
})

watch(
  () => [props.isLoading, props.text] as const,
  ([isLoading]) => {
    if (!isLoading) {
      typingEffect.clear()
      clearCompleteTimer()
      typedText.value = ''
      isTypingComplete.value = false
      return
    }

    clearCompleteTimer()
    isTypingComplete.value = false
    typingEffect.start()
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  typingEffect.clear()
  clearCompleteTimer()
  void closeTypingSound()
})
</script>

<template>
  <div v-if="props.isLoading" v-draggable class="dots-loading">
    <span class="dots">
      <span class="dot">.</span>
      <span class="dot">.</span>
      <span class="dot">.</span>
    </span>
    <span v-if="typedText" class="loading-text">{{ typedText }}</span>
    <div v-if="isTypingComplete" class="loading-actions">
      <button
        class="loading-action loading-action-ok"
        type="button"
        @click="handleConfirm"
      >
        {{ confirmText }}
      </button>
      <button
        class="loading-action loading-action-return"
        type="button"
        @click="handleReturn"
      >
        {{ returnText }}
      </button>
    </div>
  </div>
</template>

<style scoped src="../../assets/css/dot.css"></style>