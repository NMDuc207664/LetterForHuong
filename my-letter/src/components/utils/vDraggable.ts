// vDraggable.ts
import type { Directive } from 'vue'

type DraggableElement = HTMLElement & {
  __draggableCleanup__?: () => void
}

export const vDraggable: Directive = {
  mounted(el: HTMLElement) {
    // Tìm phần header để làm vùng nắm kéo (hoặc kéo từ chính element)
    const handle = el.querySelector('.dialog-header') as HTMLElement || el
    handle.style.cursor = 'grab'

    let isDragging = false
    let startX = 0
    let startY = 0
    let initialLeft = 0
    let initialTop = 0

    const isInteractiveTarget = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false

      return Boolean(
        target.closest('input, textarea, select, button, a, [contenteditable="true"]')
      )
    }

    const clampPosition = (left: number, top: number) => {
      const rect = el.getBoundingClientRect()
      const maxLeft = Math.max(0, window.innerWidth - rect.width)
      const maxTop = Math.max(0, window.innerHeight - rect.height)

      return {
        left: Math.min(Math.max(0, left), maxLeft),
        top: Math.min(Math.max(0, top), maxTop)
      }
    }

    const keepInsideViewport = () => {
      if (el.style.position !== 'fixed') return

      const rect = el.getBoundingClientRect()
      const nextPos = clampPosition(rect.left, rect.top)
      el.style.left = `${nextPos.left}px`
      el.style.top = `${nextPos.top}px`
    }

    const onMouseDown = (e: MouseEvent) => {
      // Chỉ xử lý khi nhấn chuột trái (button = 0)
      if (e.button !== 0) return
      if (isInteractiveTarget(e.target)) return

      isDragging = true
      startX = e.clientX
      startY = e.clientY

      // Lấy vị trí hiện tại của dialog
      const rect = el.getBoundingClientRect()
      initialLeft = rect.left
      initialTop = rect.top

      // Đổi position sang fixed/absolute để di chuyển tự do
      el.style.position = 'fixed'
      el.style.margin = '0'
      // Với các phần tử đang canh giữa bằng transform (như translate),
      // cần reset transform để tránh nhảy vị trí khi vừa click.
      el.style.transform = 'none'
      el.style.left = `${initialLeft}px`
      el.style.top = `${initialTop}px`

      // Lắng nghe sự kiện di chuyển và nhả chuột trên toàn document
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const dx = e.clientX - startX
      const dy = e.clientY - startY
      const nextPos = clampPosition(initialLeft + dx, initialTop + dy)

      el.style.left = `${nextPos.left}px`
      el.style.top = `${nextPos.top}px`
    }

    const onMouseUp = () => {
      isDragging = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    handle.addEventListener('mousedown', onMouseDown)

    window.addEventListener('resize', keepInsideViewport)
    window.addEventListener('orientationchange', keepInsideViewport)

    ;(el as DraggableElement).__draggableCleanup__ = () => {
      handle.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('resize', keepInsideViewport)
      window.removeEventListener('orientationchange', keepInsideViewport)
    }
  },

  beforeUnmount(el: HTMLElement) {
    ;(el as DraggableElement).__draggableCleanup__?.()
  }
}