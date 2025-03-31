import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合併 Tailwind CSS 類名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化數字（例如：1000 -> 1k）
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  } else {
    return num.toString()
  }
}

/**
 * 獲取語言對應的顏色
 */
export function getLanguageColor(language: string | null): string {
  if (!language) return 'bg-gray-400'

  const colorMap: Record<string, string> = {
    'JavaScript': 'bg-yellow-400',
    'TypeScript': 'bg-blue-500',
    'Python': 'bg-green-500',
    'Java': 'bg-orange-600',
    'Go': 'bg-cyan-500',
    'C++': 'bg-pink-600',
    'Ruby': 'bg-red-600',
    'Rust': 'bg-orange-800',
    'PHP': 'bg-indigo-500',
    'C#': 'bg-green-600',
    'Swift': 'bg-orange-500',
    'Kotlin': 'bg-purple-500',
    'Dart': 'bg-blue-400',
    'HTML': 'bg-red-500',
    'CSS': 'bg-blue-600',
  }

  return colorMap[language] || 'bg-primary'
}
