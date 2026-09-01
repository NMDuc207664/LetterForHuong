import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Tracks an appropriate page-body height based on the current viewport height,
 * and recalculates automatically on window resize.
 *
 * The height is clamped between 320 px and 520 px (50% of viewport height).
 */
export const usePageBodyHeight = () => {
  const pageBodyHeight = ref(420)

  const recalculate = () => {
    const half = Math.round(window.innerHeight * 0.5)
    pageBodyHeight.value = Math.max(320, Math.min(520, half))
  }

  onMounted(() => {
    recalculate()
    window.addEventListener('resize', recalculate)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', recalculate)
  })

  return { pageBodyHeight }
}
