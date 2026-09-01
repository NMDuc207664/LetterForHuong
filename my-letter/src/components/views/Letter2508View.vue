<script setup lang="ts">
import LetterLayout from '../genenric/LetterLayout.vue'
import { parseTaggedLetter } from '../utils/letterParser'
import letter2508Raw from '../../translate/2508.letter.txt?raw'

const letter2508 = parseTaggedLetter(letter2508Raw)
</script>

<template>
     <LetterLayout
    :title="letter2508.title"
    :date="letter2508.date"
    :content="letter2508.content"
  />
</template>