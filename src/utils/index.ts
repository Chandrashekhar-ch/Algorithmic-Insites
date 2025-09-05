// Utility functions for the Algorithmic Insights platform

import type { AlgorithmStep, AppError, AlgorithmStatistics } from '../types'

/**
 * Generates a random array of numbers for algorithm visualization
 */
export function generateRandomArray(size: number, min: number = 1, max: number = 100): number[] {
  const array: number[] = []
  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * (max - min + 1)) + min)
  }
  return array
}

/**
 * Generates a sorted array (ascending or descending)
 */
export function generateSortedArray(size: number, ascending: boolean = true): number[] {
  const array = Array.from({ length: size }, (_, i) => i + 1)
  return ascending ? array : array.reverse()
}

/**
 * Generates a nearly sorted array with some random swaps
 */
export function generateNearlySortedArray(size: number, swapCount: number = 3): number[] {
  const array = generateSortedArray(size)
  
  for (let i = 0; i < swapCount; i++) {
    const idx1 = Math.floor(Math.random() * size)
    const idx2: number = Math.floor(Math.random() * size)
    if (array[idx1] !== undefined && array[idx2] !== undefined) {
      [array[idx1], array[idx2]] = [array[idx2], array[idx1]]
    }
  }
  
  return array
}

/**
 * Validates if an array is sorted
 */
export function isSorted(array: number[], ascending: boolean = true): boolean {
  for (let i = 1; i < array.length; i++) {
    const current = array[i]
    const previous = array[i - 1]
    if (current === undefined || previous === undefined) continue
    
    if (ascending && current < previous) return false
    if (!ascending && current > previous) return false
  }
  return true
}

/**
 * Calculates algorithm statistics from steps
 */
export function calculateStatistics(steps: AlgorithmStep[]): AlgorithmStatistics {
  let totalComparisons = 0
  let totalSwaps = 0
  
  steps.forEach(step => {
    totalComparisons += step.metadata.comparisons
    totalSwaps += step.metadata.swaps
  })
  
  const firstStep = steps[0]
  const lastStep = steps[steps.length - 1]
  const totalTime = steps.length > 0 && firstStep && lastStep ? lastStep.timestamp - firstStep.timestamp : 0
  const averageTime = steps.length > 0 ? totalTime / steps.length : 0
  
  return {
    totalComparisons,
    totalSwaps,
    totalTime,
    averageTime,
    bestCase: 'O(n)', // Default - should be overridden by specific algorithms
    worstCase: 'O(n²)',
    averageCase: 'O(n²)',
    spaceComplexity: 'O(1)'
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = window.setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Deep clones an object/array
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
  
  const cloned = {} as T
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key])
    }
  }
  return cloned
}

/**
 * Formats time duration for display
 */
export function formatDuration(milliseconds: number): string {
  if (milliseconds < 1000) return `${milliseconds}ms`
  if (milliseconds < 60000) return `${(milliseconds / 1000).toFixed(1)}s`
  return `${(milliseconds / 60000).toFixed(1)}m`
}

/**
 * Formats large numbers with appropriate units
 */
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString()
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`
  if (num < 1000000000) return `${(num / 1000000).toFixed(1)}M`
  return `${(num / 1000000000).toFixed(1)}B`
}

/**
 * Generates a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Creates an AppError with proper formatting
 */
export function createError(
  code: string,
  message: string,
  severity: AppError['severity'] = 'medium',
  context?: any
): AppError {
  const stack = new Error().stack
  return {
    code,
    message,
    severity,
    context,
    timestamp: Date.now(),
    ...(stack && { stack })
  }
}

/**
 * Validates array input for algorithms
 */
export function validateArrayInput(input: any[]): { isValid: boolean; error?: string } {
  if (!Array.isArray(input)) {
    return { isValid: false, error: 'Input must be an array' }
  }
  
  if (input.length === 0) {
    return { isValid: false, error: 'Array cannot be empty' }
  }
  
  if (input.length > 1000) {
    return { isValid: false, error: 'Array size limited to 1000 elements' }
  }
  
  if (!input.every(item => typeof item === 'number')) {
    return { isValid: false, error: 'All array elements must be numbers' }
  }
  
  return { isValid: true }
}

/**
 * Formats algorithm complexity notation
 */
export function formatComplexity(complexity: string): string {
  return complexity
    .replace(/\*/g, '·')
    .replace(/\^/g, '²')
    .replace(/log/g, 'log')
}

/**
 * Color interpolation for visualizations
 */
export function interpolateColor(color1: string, color2: string, factor: number): string {
  const hex = (color: string) => parseInt(color.slice(1), 16)
  const r1 = (hex(color1) >> 16) & 255
  const g1 = (hex(color1) >> 8) & 255
  const b1 = hex(color1) & 255
  
  const r2 = (hex(color2) >> 16) & 255
  const g2 = (hex(color2) >> 8) & 255
  const b2 = hex(color2) & 255
  
  const r = Math.round(r1 + (r2 - r1) * factor)
  const g = Math.round(g1 + (g2 - g1) * factor)
  const b = Math.round(b1 + (b2 - b1) * factor)
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

/**
 * Checks if the browser supports required features
 */
export function checkBrowserSupport(): { 
  supported: boolean
  missing: string[]
} {
  const missing: string[] = []
  
  if (!window.requestAnimationFrame) missing.push('requestAnimationFrame')
  if (!window.localStorage) missing.push('localStorage')
  if (!window.fetch) missing.push('fetch')
  if (!('serviceWorker' in navigator)) missing.push('serviceWorker')
  
  return {
    supported: missing.length === 0,
    missing
  }
}

/**
 * Gets device performance tier for optimization
 */
export function getPerformanceTier(): 'low' | 'medium' | 'high' {
  const memory = (navigator as any).deviceMemory || 4
  const cores = navigator.hardwareConcurrency || 4
  
  if (memory <= 2 || cores <= 2) return 'low'
  if (memory <= 4 || cores <= 4) return 'medium'
  return 'high'
}

/**
 * Optimizes visualization settings based on device performance
 */
export function getOptimizedSettings() {
  const tier = getPerformanceTier()
  
  switch (tier) {
    case 'low':
      return {
        maxElements: 50,
        animationDuration: 100,
        updateFrequency: 'slow'
      }
    case 'medium':
      return {
        maxElements: 100,
        animationDuration: 200,
        updateFrequency: 'medium'
      }
    case 'high':
      return {
        maxElements: 500,
        animationDuration: 300,
        updateFrequency: 'fast'
      }
  }
}

/**
 * Handles async operations with proper error handling
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<{ data?: T; error?: AppError }> {
  try {
    const data = await operation()
    return { data }
  } catch (err) {
    const error = createError(
      'ASYNC_ERROR',
      err instanceof Error ? err.message : 'Unknown async error',
      'medium',
      err
    )
    
    if (fallback !== undefined) {
      return { data: fallback, error }
    }
    
    return { error }
  }
}

/**
 * Local storage utilities with error handling
 */
export const storage = {
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch {
      return defaultValue || null
    }
  },
  
  set(key: string, value: any): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },
  
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  }
}
