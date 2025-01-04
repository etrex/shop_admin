import { onMounted } from 'vue'
import { colors, textColors, borderColors, backgroundColors, layout } from '@/assets/styles/variables'

export function useTheme() {
  const initializeTheme = () => {
    // Colors
    Object.entries(colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}-color`, value)
    })

    // Text Colors
    Object.entries(textColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--text-${key}`, value)
    })

    // Border Colors
    Object.entries(borderColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--border-${key}`, value)
    })

    // Background Colors
    Object.entries(backgroundColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--background-${key}`, value)
    })

    // Layout
    Object.entries(layout).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value)
    })
  }

  onMounted(() => {
    initializeTheme()
  })

  return {
    initializeTheme
  }
} 