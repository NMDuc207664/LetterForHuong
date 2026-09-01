<script setup lang="ts">
import { ref } from 'vue'

const letterContent = ref('')
const isSending = ref(false)

const handleSend = async () => {
  if (!letterContent.value.trim()) {
    alert('Vui lòng nhập nội dung thư trước khi gửi!')
    return
  }

  isSending.value = true
  try {
    // Tạm thời log ra console. Bước sau chúng ta sẽ gắn Axios vào đây.
    console.log('Nội dung chuẩn bị gửi:', letterContent.value)
    alert('Đã ghi nhận nội dung, chuẩn bị tích hợp API ở bước sau!')
  } catch (error) {
    console.error('Lỗi:', error)
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <div class="container">
    <h2>Gửi Tâm Thư</h2>
    
    <textarea
      v-model="letterContent"
      placeholder="Viết những điều bạn muốn nói vào đây..."
      rows="12"
    ></textarea>
    
    <button @click="handleSend" :disabled="isSending">
      {{ isSending ? 'Đang gửi đi...' : 'Gửi Thư' }}
    </button>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: system-ui, -apple-system, sans-serif;
}

textarea {
  width: 100%;
  padding: 16px;
  font-size: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  resize: vertical;
  outline: none;
  transition: border-color 0.3s;
}

textarea:focus {
  border-color: #4096ff;
}

button {
  padding: 12px 24px;
  background-color: #1677ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #4096ff;
}

button:disabled {
  background-color: #f5f5f5;
  color: #b8b8b8;
  cursor: not-allowed;
}
</style>