// src/utils/fireworks.js
import { Fireworks } from 'fireworks-js'

let fireworksInstance = null

export const triggerFireworks = (durationInSeconds = 3) => {
  // 1. Tạo container tạm thời phủ toàn màn hình
  let container = document.getElementById('fireworks-container')
  
  if (!container) {
    container = document.createElement('div')
    container.id = 'fireworks-container'
    
    // Đặt style xuyên qua chuột (pointer-events: none) để không cản trở click
    Object.assign(container.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: '99999'
    })
    
    document.body.appendChild(container)
  }

  // 2. Khởi tạo hiệu ứng với tông màu Tím - Hồng lãng mạn
  fireworksInstance = new Fireworks(container, {
    autoresize: true,
    opacity: 0.5,
    acceleration: 1.05,
    friction: 0.97,
    gravity: 1.5,
    particles: 50,
    traceLength: 3,
    traceSpeed: 10,
    explosion: 5,
    intensity: 30,
    flickering: 50,
    lineStyle: 'round',
    hue: { min: 250, max: 340 }, // Tải màu từ Tím (#65479a) đến Hồng
    delay: { min: 30, max: 60 }
  })

  // 3. Bắt đầu bắn pháo hoa
  fireworksInstance.start()

  // 4. Dừng và dọn dẹp sau X giây
  setTimeout(() => {
    if (fireworksInstance) {
      fireworksInstance.stop()
      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
      }
      fireworksInstance = null
    }
  }, durationInSeconds * 1000)
}