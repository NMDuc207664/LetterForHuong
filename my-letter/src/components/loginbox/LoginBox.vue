<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import type { Hint } from '../constants/Hint'
import type { EnterIcon } from '../constants/EnterIcon'
import { vDraggable } from '../utils/vDraggable'
import { createTypingEffect } from './../genenric/typingEffect'
import { closeTypingSound, playTypingSound } from './../genenric/typingSound'

const password = ref('')
const emit = defineEmits<{
  submit: [password: string]
}>()

const typedText = ref('')

const props = defineProps(
    {
        hintConfig:{
            type: Object as () => Hint,
            default: () => ({ hint: '' })
        },
        iconConfig:{
            type: Object as () => EnterIcon,
            default: () => ({ enterIcon: '↵' })
        },
        disabled: {
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
    }
)
const handleSubmit = () => {
  if (props.disabled) return
  emit('submit', password.value)
}

const typingEffect = createTypingEffect({
  getText: () => props.hintConfig?.hint || '',
  isActive: () => !props.disabled,
  delay: () => props.typingDelay,
  step: () => props.typingStep,
  onCharacter: (value: string) => {
    const isNewCharacter = value.length > typedText.value.length
    typedText.value = value

    if (isNewCharacter) {
      void playTypingSound()
    }
  }
})

watch(
  () => [props.disabled, props.hintConfig?.hint] as const,
  ([isDisabled]) => {
    if (isDisabled) {
      typingEffect.clear()
      typedText.value = ''
      return
    }

    typingEffect.start()
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  typingEffect.clear()
  void closeTypingSound()
})
</script>

<template>

    <!-- Login box -->
    <section v-if="!props.disabled" v-draggable class="login-box">

      <!-- Hint -->
      <p class="hint">
        "{{ typedText }}"
      </p>

      <div class="divider"></div>

      <!-- Password -->
      
        <div class="password-input">
          <input
            id="password"
            v-model="password"
            type="text"
            maxlength="4"
            placeholder=""
            @keyup.enter="handleSubmit"
            autocomplete="off"
          />

          <button
            class="enter-button"
            type="button"
            @click="handleSubmit"
          >
              {{ props.iconConfig?.enterIcon }}
          </button>
        </div>

    </section>
</template>