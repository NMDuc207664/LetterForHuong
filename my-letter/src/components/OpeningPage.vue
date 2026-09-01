<!-- <script setup lang="ts">
import { ref } from 'vue'
import heroImg from '../assets/hero.png'
import viteLogo from '../assets/vite.svg'
import vueLogo from '../assets/vue.svg'

const count = ref(0)
</script>

<template>
  <section id="center">
    <div class="hero">
      <img :src="heroImg" class="base" width="170" height="179" alt="" />
      <img :src="vueLogo" class="framework" alt="Vue logo" />
      <img :src="viteLogo" class="vite" alt="Vite logo" />
    </div>
    <div>
      <h1>Get started</h1>
      <p>Edit <code>src/App.vue</code> and save to test <code>HMR</code></p>
    </div>
    <button type="button" class="counter" @click="count++">
      Count is {{ count }}
    </button>
  </section>

  <div class="ticks"></div>

  <section id="next-steps">
    <div id="docs">
      <svg class="icon" role="presentation" aria-hidden="true">
        <use href="/icons.svg#documentation-icon"></use>
      </svg>
      <h2>Documentation</h2>
      <p>Your questions, answered</p>
      <ul>
        <li>
          <a href="https://vite.dev/" target="_blank">
            <img class="logo" :src="viteLogo" alt="" />
            Explore Vite
          </a>
        </li>
        <li>
          <a href="https://vuejs.org/" target="_blank">
            <img class="button-icon" :src="vueLogo" alt="" />
            Learn more
          </a>
        </li>
      </ul>
    </div>
    <div id="social">
      <svg class="icon" role="presentation" aria-hidden="true">
        <use href="/icons.svg#social-icon"></use>
      </svg>
      <h2>Connect with us</h2>
      <p>Join the Vite community</p>
      <ul>
        <li>
          <a href="https://github.com/vitejs/vite" target="_blank">
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#github-icon"></use>
            </svg>
            GitHub
          </a>
        </li>
        <li>
          <a href="https://chat.vite.dev/" target="_blank">
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#discord-icon"></use>
            </svg>
            Discord
          </a>
        </li>
        <li>
          <a href="https://x.com/vite_js" target="_blank">
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#x-icon"></use>
            </svg>
            X.com
          </a>
        </li>
        <li>
          <a href="https://bsky.app/profile/vite.dev" target="_blank">
            <svg class="button-icon" role="presentation" aria-hidden="true">
              <use href="/icons.svg#bluesky-icon"></use>
            </svg>
            Bluesky
          </a>
        </li>
      </ul>
    </div>
  </section>

  <div class="ticks"></div>
  <section id="spacer"></section>
</template> -->

<script setup lang="ts">
import { computed, ref } from 'vue'
import LoginBox from './loginbox/LoginBox.vue';
import { t, type Namespace } from './utils/i18n'
import DotLoading from './genenric/DotLoading.vue';
import { useRouter } from 'vue-router'
import { hintMap } from './constants/LoginBoxHintMap'
import { triggerCongrat } from './utils/confetti'
import { triggerFireworks } from './utils/fireworks.js'
import FloatingBackground from './genenric/FloatingBackground.vue'
import HoverMinigame from './genenric/HoverMinigame.vue'
import SoundPlayer from './genenric/SoundPlayer.vue'

const props = defineProps({
  resetHintAfterTwoMoreWrong: {
    type: Boolean,
    default: true
  }
})

const router = useRouter()
const currentLang = ref<Namespace>('vie')
const isAudioUnlocked = ref(false)
const showConfirmation = ref(false)
const isShake = ref(false)
const isMinigameOn = ref(false)

const unlock = () => {
  isAudioUnlocked.value = true
}
const wrongAttempts = ref(0)
const pastAttempts = ref(0)
const hintText = ref(t(currentLang.value, 'hint_first_meet'))

const myHint = computed(() => ({
  hint: hintText.value
}))

// Tạo object cấu hình cho icon
const myIcon = computed(() => ({
  enterIcon: t(currentLang.value, 'enter_icon')
}))

const loadingText = computed(() => t(currentLang.value, 'are_you_sure'))

const handleLoadingReturn = () => {
  showConfirmation.value = false
  router.replace('/home')
}

const handleSubmit = (password: string) => {
  const result = password.trim()

  if (result === '2507') {
    sessionStorage.setItem('puzzleAccess', '2507')
    wrongAttempts.value = 0
    hintText.value = t(currentLang.value, 'hint_first_meet')
    showConfirmation.value = false
    router.push('/2507')

    return
  }


  if (result === '2508') {
    pastAttempts.value++
    if(pastAttempts.value > 1 && pastAttempts.value < 3) {
      hintText.value = t(currentLang.value, 'dot')
      isShake.value = true
       setTimeout(() => {
        isShake.value = false
      }, 400)
    }
    if(pastAttempts.value === 3) {
      hintText.value = t(currentLang.value, 'dot_2')
      isShake.value = true
       setTimeout(() => {
        isShake.value = false
      }, 400)
    }
    if (pastAttempts.value > 3) {
      showConfirmation.value = true
    }
    return
  }

  // Sai password: cập nhật hint ngay tại lần submit sai.
  wrongAttempts.value++
  isShake.value = true
  setTimeout(() => {
      isShake.value = false
    }, 400)

  if (props.resetHintAfterTwoMoreWrong && wrongAttempts.value >= 8) {
    hintText.value = t(currentLang.value, 'hint_first_meet')
    wrongAttempts.value = 0
  }
  
  if (wrongAttempts.value === 7) {
    triggerFireworks(6)
  }

  const mappedHint = hintMap[wrongAttempts.value]//ép kiểu do nó có undefined ko call thẳng được
  if (mappedHint) {
    hintText.value = t(currentLang.value, mappedHint)
  }
}

const confirm2508 = () => {
  sessionStorage.setItem('puzzleAccess', '2508')
  showConfirmation.value = false
  wrongAttempts.value = 0
  hintText.value = t(currentLang.value, 'hint_first_meet')
  router.push('/2508')
}
</script>

<template>
  <main class="page">
    <!-- Background -->
    <div class="background"></div>
    <FloatingBackground />
    <HoverMinigame :active="isMinigameOn" />
    <SoundPlayer />

    <button
      type="button"
      class="minigame-toggle"
      :class="{ 'is-on': isMinigameOn }"
      :aria-label="isMinigameOn ? t('vie', 'minigame_off') : t('vie', 'minigame_on')"
      @click="isMinigameOn = !isMinigameOn"
    >
      🎮
    </button>

    <!-- Overlay unlock âm thanh: ẩn ngay sau click đầu tiên -->
    <Transition name="unlock-fade">
      <div
        v-if="!isAudioUnlocked"
        class="audio-unlock-overlay"
        @click="unlock"
        @animationend="triggerCongrat(3)"
        @touchstart.passive="unlock"
      >
        <span class="audio-unlock-hint">{{ t('vie', 'start') }}</span>
      </div>
    </Transition>

    <template v-if="isAudioUnlocked">
      <LoginBox 
        :hintConfig="myHint" 
        :iconConfig="myIcon"
        :disabled="showConfirmation"
        :class="{ shake: isShake }"
        @submit="handleSubmit"
      />
      <DotLoading
        :is-loading="showConfirmation"
        :text="loadingText"
        :typingDelay="3000"
        @confirm="confirm2508"
        @return="handleLoadingReturn"
      />
    </template>
  </main>
</template>