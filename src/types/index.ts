// Global type definitions for Algorithmic Insights platform

export interface AlgorithmStep {
  id: string
  type: 'compare' | 'swap' | 'insert' | 'delete' | 'traverse' | 'highlight' | 'complete'
  description: string
  data: number[]
  metadata: {
    comparisons: number
    swaps: number
    timeComplexity: string
    spaceComplexity: string
    currentIndices?: number[]
    highlightedElements?: number[]
    // Visualization-specific metadata
    sorted?: number[]
    comparing?: number[]
    swapping?: number[]
    visiting?: string[]
    visited?: string[]
    path?: string[]
  }
  timestamp: number
}

export interface AlgorithmState {
  dataset: number[]
  data: any // For flexible data types (array, tree, graph)
  steps: AlgorithmStep[]
  currentStep: number // Changed from currentStepIndex for consistency
  currentStepIndex: number // Keep for backward compatibility
  isPlaying: boolean
  isComplete: boolean
  speed: number // milliseconds between steps
  algorithm: string
  statistics: AlgorithmStatistics
}

export interface AlgorithmStatistics {
  totalComparisons: number
  totalSwaps: number
  totalTime: number
  averageTime: number
  bestCase: string
  worstCase: string
  averageCase: string
  spaceComplexity: string
}

export interface VisualizationConfig {
  width: number
  height: number
  margin: {
    top: number
    right: number
    bottom: number
    left: number
  }
  colors: {
    default: string
    comparing: string
    swapping: string
    sorted: string
    pivot: string
  }
  animation: {
    duration: number
    easing: string
  }
}

export interface TreeNode {
  id: string
  value: number
  left?: TreeNode
  right?: TreeNode
  parent?: TreeNode
  x?: number
  y?: number
  depth?: number
  isHighlighted?: boolean
  isComparing?: boolean
  isSwapping?: boolean
}

export interface GraphNode {
  id: string
  label: string
  value?: number
  x?: number
  y?: number
  isVisited?: boolean
  isDiscovered?: boolean
  isProcessing?: boolean
  distance?: number
  previous?: string | null
}

export interface GraphEdge {
  source: string
  target: string
  weight?: number
  isTraversed?: boolean
  isDiscovering?: boolean
  isHighlighted?: boolean
}

export interface AIExplanation {
  stepId: string
  algorithm: string
  explanation: string
  concepts: string[]
  timeComplexity: string
  spaceComplexity: string
  tips: string[]
  relatedTopics: string[]
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    message: string
    code: string
    details?: any
  }
  metadata?: {
    timestamp: string
    version: string
    requestId: string
  }
}

export interface OllamaRequest {
  algorithm: string
  currentStep: AlgorithmStep
  context: {
    previousSteps: AlgorithmStep[]
    dataset: number[]
    currentIndex: number
  }
  options?: {
    model?: string
    temperature?: number
    maxTokens?: number
  }
}

export interface OllamaResponse {
  explanation: string
  concepts: string[]
  nextStepHint?: string
  performance: {
    responseTime: number
    model: string
  }
}

export interface PWAInstallPrompt {
  isVisible: boolean
  isInstallable: boolean
  isInstalled: boolean
  deferredPrompt?: any
}

export interface AppError {
  code: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  context?: any
  timestamp: number
  stack?: string
}

// Utility types
export type SortingAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap'
export type TreeAlgorithm = 'bst-insert' | 'bst-delete' | 'bst-search' | 'avl-insert' | 'avl-delete'
export type GraphAlgorithm = 'bfs' | 'dfs' | 'dijkstra' | 'astar' | 'bellman-ford'

export type AlgorithmCategory = 'sorting' | 'searching' | 'tree' | 'graph' | 'dynamic-programming'

export interface AlgorithmMetadata {
  name: string
  category: AlgorithmCategory
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  timeComplexity: {
    best: string
    average: string
    worst: string
  }
  spaceComplexity: string
  description: string
  useCases: string[]
  prerequisites: string[]
}

// Store types
export interface AlgorithmStore {
  // Main algorithm state
  main: AlgorithmState
  
  // Comparison algorithm state
  comparison: AlgorithmState
  
  // Global state
  comparisonMode: boolean
  selectedAlgorithm: string
  isLoading: boolean
  error: AppError | null
  
  // PWA state
  pwa: PWAInstallPrompt
  
  // Actions
  setDataset: (data: number[], isComparison?: boolean) => void
  setSteps: (steps: AlgorithmStep[], isComparison?: boolean) => void
  setCurrentStepIndex: (index: number, isComparison?: boolean) => void
  setIsPlaying: (playing: boolean, isComparison?: boolean) => void
  setSpeed: (speed: number, isComparison?: boolean) => void
  setAlgorithm: (algorithm: string, isComparison?: boolean) => void
  
  reset: (isComparison?: boolean) => void
  play: (isComparison?: boolean) => void
  pause: (isComparison?: boolean) => void
  nextStep: (isComparison?: boolean) => void
  previousStep: (isComparison?: boolean) => void
  
  setComparisonMode: (enabled: boolean) => void
  setError: (error: AppError | null) => void
  setLoading: (loading: boolean) => void
}

// Event types
export interface AlgorithmEvent {
  type: 'step-changed' | 'play-state-changed' | 'algorithm-complete' | 'error-occurred'
  payload: any
  timestamp: number
}

// D3 visualization types
export interface D3Selection<T = any> {
  selectAll: (selector: string) => D3Selection<T>
  data: (data: T[]) => D3Selection<T>
  enter: () => D3Selection<T>
  exit: () => D3Selection<T>
  append: (element: string) => D3Selection<T>
  attr: (name: string, value: any) => D3Selection<T>
  style: (name: string, value: any) => D3Selection<T>
  text: (value: any) => D3Selection<T>
  transition: () => D3Selection<T>
  duration: (ms: number) => D3Selection<T>
  remove: () => D3Selection<T>
  call: (fn: any) => D3Selection<T>
  on: (event: string, handler: Function) => D3Selection<T>
}

export interface VisualizationHookOptions {
  dependencies: any[]
  cleanup?: () => void
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  isComparison?: boolean
  isLoading?: boolean
  error?: AppError | null
}

export interface VisualizerProps extends BaseComponentProps {
  width?: number
  height?: number
  config?: Partial<VisualizationConfig>
  onStepChange?: (step: AlgorithmStep) => void
  onComplete?: () => void
  onError?: (error: AppError) => void
}
