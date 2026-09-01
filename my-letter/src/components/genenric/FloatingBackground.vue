<script setup lang="ts">
import { computed } from 'vue'

// Tự động lấy mọi ảnh có trong assets/images, thêm ảnh mới vào đó là hiện luôn không cần sửa code.
const imageModules = import.meta.glob('../../assets/images/*.{png,jpg,jpeg,webp,svg,gif}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const imageSources = Object.values(imageModules)

const DECORATION_COUNT = 16

type Decoration = {
  id: number
  src: string
  style: Record<string, string>
}

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min)

const decorations = computed<Decoration[]>(() => {
  if (imageSources.length === 0) return []

  return Array.from({ length: DECORATION_COUNT }, (_, index) => {
    const src = imageSources[index % imageSources.length]
    const size = randomBetween(24, 64)

    return {
      id: index,
      src,
      style: {
        left: `${randomBetween(0, 96)}%`,
        top: `${randomBetween(0, 96)}%`,
        width: `${size}px`,
        height: `${size}px`,
        opacity: `${randomBetween(0.25, 0.6)}`,
        animationDuration: `${randomBetween(10, 22)}s, ${randomBetween(14, 30)}s`,
        animationDelay: `${randomBetween(0, 8)}s, ${randomBetween(0, 8)}s`,
      },
    }
  })
})
</script>

<template>
  <div
    v-if="decorations.length"
    class="floating-background"
    aria-hidden="true"
  >
    <img
      v-for="deco in decorations"
      :key="deco.id"
      :src="deco.src"
      class="floating-item"
      :style="deco.style"
      alt=""
    />
  </div>
</template>

<style scoped src="../../assets/css/floatingbackground.css"></style>
