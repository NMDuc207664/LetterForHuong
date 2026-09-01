<script setup lang="ts">
import LetterLayout from '../genenric/LetterLayout.vue'
import { parseTaggedLetter } from '../utils/letterParser'
import letter2508Raw from '../../translate/2508.letter.txt?raw'

const letter2507 = parseTaggedLetter(letter2508Raw)
</script>

<template>
  <LetterLayout
    :title="letter2507.title"
    :date="letter2507.date"
    :content="letter2507.content"
  />
</template>