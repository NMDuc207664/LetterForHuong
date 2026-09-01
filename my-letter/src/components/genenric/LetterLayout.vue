<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { clearPuzzleAccess } from '../utils/clearPuzzle.js'
import { t } from '../utils/i18n'
import { usePageBodyHeight } from '../utils/usePageBodyHeight'
import { useAutoPagination } from '../utils/useAutoPagination'
import { usePageFlipAudio } from '../utils/usePageFlipAudio'

const props = defineProps<{
  title: string
  date?: string
  pages?: string[]
  content?: string
}>()

const router = useRouter()
const measureRef = ref<HTMLElement | null>(null)

const { pageBodyHeight } = usePageBodyHeight()
const { autoPages, rebuild: rebuildPages } = useAutoPagination(
  () => props.content,
  () => measureRef.value,
  () => pageBodyHeight.value,
)
const { play: playPageFlipSound } = usePageFlipAudio()

const currentPage = ref(1)
const flipDirection = ref<'next' | 'prev'>('next')

const totalPages = computed(() => {
  if ((props.pages?.length ?? 0) > 0) return props.pages!.length
  return autoPages.value.length || 1
})

// Windowed page list: always show first/last page, a small range around the
// current page, and '…' markers for the gaps. Keeps the nav compact even
// when a letter has dozens of pages (avoids overflow on small screens).
const visiblePages = computed<(number | '…')[]>(() => {
  const total = totalPages.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const current = currentPage.value
  const pages = new Set<number>([1, total, current])
  if (current - 1 > 1) pages.add(current - 1)
  if (current + 1 < total) pages.add(current + 1)

  const sorted = [...pages].sort((a, b) => a - b)
  const result: (number | '…')[] = []

  sorted.forEach((page, index) => {
    const previous = sorted[index - 1]
    if (previous !== undefined && page - previous > 1) result.push('…')
    result.push(page)
  })

  return result
})

// Unified page source: explicit pages prop takes priority over auto-split pages.
const activePageSource = computed(() =>
  (props.pages?.length ?? 0) > 0 ? props.pages! : autoPages.value
)

const displayedParagraphs = computed(() => {
  const pageContent = activePageSource.value[currentPage.value - 1] ?? ''
  return pageContent
    .split(/\n\s*\n/g)
    .map(p => p.trim())
    .filter(Boolean)
})

const hasStructuredPages = computed(() =>
  (props.pages?.length ?? 0) > 0 || autoPages.value.length > 0
)

/**
 * Navigates to the given page number and plays the flip sound.
 * Does nothing if the page is out of range or already active.
 */
const goToPage = (page: number) => {
  if (page === currentPage.value || page < 1 || page > totalPages.value) return

  flipDirection.value = page > currentPage.value ? 'next' : 'prev'
  currentPage.value = page
  playPageFlipSound()
}

/** Clears the puzzle token and returns to the home screen. */
const goHome = () => {
  clearPuzzleAccess()
  router.replace('/')
}

/** Opens the reply page in a new tab. */
const reply = () => {
  window.open('/reply', '_blank', 'noopener,noreferrer')
}

// Clamp currentPage when the total number of pages shrinks.
watch(totalPages, nextTotal => {
  if (currentPage.value > nextTotal) currentPage.value = nextTotal
})

// Rebuild pages whenever the content prop changes, and reset to page 1.
watch(() => props.content, async () => {
  await rebuildPages()
  currentPage.value = 1
})

// Rebuild pages whenever the available height changes (e.g. window resize).
watch(pageBodyHeight, () => rebuildPages())

onMounted(() => rebuildPages())
</script>

<template>
  <main class="letter-page">

    <div class="letter-background"></div>

    <article class="letter">

      <!-- Header -->
      <header class="letter-header">

        <button
          class="home-button"
          type="button"
          @click="goHome"
        >
          {{ t('vie', 'home_button') }}
        </button>

        <p
          v-if="date"
          class="letter-date"
        >
          {{ date }}
        </p>

      </header>


      <!-- Letter -->
      <section class="letter-content">

        <h1 class="letter-title">
          {{ title }}
        </h1>

        <div class="letter-body">
          <Transition
            :name="flipDirection === 'next' ? 'page-flip-next' : 'page-flip-prev'"
            mode="out-in"
          >
            <div
              :key="currentPage"
              class="page-surface"
              :style="{ '--page-body-height': `${pageBodyHeight}px` }"
            >
              <template v-if="hasStructuredPages">
                <p
                  v-for="(paragraph, index) in displayedParagraphs"
                  :key="index"
                >
                  {{ paragraph }}
                </p>
              </template>
              <slot v-else />
            </div>
          </Transition>

          <div
            ref="measureRef"
            class="page-measure"
            :style="{ '--page-body-height': `${pageBodyHeight}px` }"
            aria-hidden="true"
          ></div>
        </div>

      </section>


      <!-- Reply -->
      <footer class="letter-footer">

        <nav
          v-if="totalPages > 1"
          class="page-nav"
          aria-label="Phan trang thu"
        >
          <button
            class="page-arrow"
            type="button"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            ‹
          </button>

          <span class="page-indicator">{{ currentPage }} / {{ totalPages }}</span>

          <span class="page-numbers">
            <template
              v-for="(page, index) in visiblePages"
              :key="index"
            >
              <span
                v-if="page === '…'"
                class="page-ellipsis"
              >…</span>
              <button
                v-else
                class="page-number"
                :class="{ active: page === currentPage }"
                type="button"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
            </template>
          </span>

          <button
            class="page-arrow"
            type="button"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            ›
          </button>
        </nav>

        <button
          class="reply-button"
          type="button"
          @click="reply"
        >
          {{ t('vie', 'reply_button') }}
        </button>

      </footer>

    </article>

  </main>
</template>

<style scoped src="../../assets/css/letterlayout.css"></style>