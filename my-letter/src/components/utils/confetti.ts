// utils/confetti.ts
import confetti from 'canvas-confetti'

export const triggerCongrat = (durationInSeconds: number = 3) => {
  const animationEnd = Date.now() + durationInSeconds * 1000

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    // Bắn pháo hoa ngẫu nhiên từ 2 góc màn hình
    confetti({
      particleCount: 40,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2
      }
    })
  }, 250)
  
}

export const triggerFireworks = (durationInSeconds: number = 3) => {
  const animationEnd = Date.now() + durationInSeconds * 1000

  // Bảng màu pastel nhẹ nhàng hợp với giao diện
  const colors = ['#65479a', '#8b70ad', '#ffb7b2', '#ffdac1', '#e2f0cb', '#ffffff']

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    // Bắn kiểu mưa sao/hoa rơi từ trên xuống
    confetti({
      particleCount: 15,
      startVelocity: 10,
      ticks: 200, // Tăng thời gian tồn tại của hạt để nó rơi chậm hơn
      gravity: 0.6, // Giảm trọng lực để hạt rơi nhẹ nhàng
      spread: 90,
      origin: {
        x: Math.random(),
        y: 0 // Bắn ra từ đỉnh màn hình
      },
      colors: colors,
      shapes: ['circle'], // Chỉ dùng hạt tròn mềm mại
      scalar: 1.2 // Kích thước hạt vừa phải
    })
  }, 150)
}

export const triggerHearts = (durationInSeconds: number = 3) => {
  const animationEnd = Date.now() + durationInSeconds * 1000
  const colors = ['#e63946', '#ffb703', '#65479a', '#ffb7b2']

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      return clearInterval(interval)
    }

    confetti({
      particleCount: 10,
      startVelocity: 15,
      gravity: 0.5,
      ticks: 250,
      origin: { x: Math.random(), y: -0.1 },
      colors: colors,
      shapes: ['star', 'circle'], // Có thể đổi thành hình sao/tròn kết hợp
      scalar: 1.5
    })
  }, 200)
}