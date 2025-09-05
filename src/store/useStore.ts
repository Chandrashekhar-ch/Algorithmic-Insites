import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

export interface AlgorithmStep {
  id: string
  description: string
  highlightedElements?: number[]
  comparingElements?: number[]
  swappingElements?: number[]
  data: number[]
}

interface AlgorithmState {
  algorithmSteps: AlgorithmStep[]
  currentStepIndex: number
  isPlaying: boolean
  speed: number
  dataset: number[]
}

interface ComparisonState {
  comparisonMode: boolean
  mainState: AlgorithmState
  comparisonState: AlgorithmState
}

interface AlgorithmActions {
  setAlgorithmSteps: (steps: AlgorithmStep[], isComparison?: boolean) => void
  setCurrentStepIndex: (index: number, isComparison?: boolean) => void
  setIsPlaying: (playing: boolean, isComparison?: boolean) => void
  setSpeed: (speed: number, isComparison?: boolean) => void
  setDataset: (data: number[], isComparison?: boolean) => void
  play: (isComparison?: boolean) => void
  pause: (isComparison?: boolean) => void
  nextStep: (isComparison?: boolean) => void
  prevStep: (isComparison?: boolean) => void
  setComparisonMode: (enabled: boolean) => void
  resetBothStates: () => void
  // Getter properties for component compatibility
  algorithmSteps: AlgorithmStep[]
  currentStepIndex: number
  isPlaying: boolean
  speed: number
  dataset: number[]
  main: AlgorithmState
  comparison: AlgorithmState
}

type AlgorithmStore = ComparisonState & AlgorithmActions

export const useStore = create<AlgorithmStore>()(
  immer((set, get) => ({
    // Comparison mode state
    comparisonMode: false,
    
    // Main state
    mainState: {
      algorithmSteps: [],
      currentStepIndex: 0,
      isPlaying: false,
      speed: 1000,
      dataset: [],
    },
    
    // Comparison state
    comparisonState: {
      algorithmSteps: [],
      currentStepIndex: 0,
      isPlaying: false,
      speed: 1000,
      dataset: [],
    },

    // Actions with dual state support
    setAlgorithmSteps: (steps, isComparison = false) =>
      set((state) => {
        const targetState = isComparison ? state.comparisonState : state.mainState
        targetState.algorithmSteps = steps
        targetState.currentStepIndex = 0
        
        // In comparison mode, update both states if not specifically targeting one
        if (state.comparisonMode && isComparison === undefined) {
          state.mainState.algorithmSteps = steps
          state.mainState.currentStepIndex = 0
          state.comparisonState.algorithmSteps = steps
          state.comparisonState.currentStepIndex = 0
        }
      }),

    setCurrentStepIndex: (index, isComparison = false) =>
      set((state) => {
        const updateState = (targetState: AlgorithmState) => {
          const maxIndex = targetState.algorithmSteps.length - 1
          targetState.currentStepIndex = Math.max(0, Math.min(index, maxIndex))
        }
        
        if (state.comparisonMode && isComparison === undefined) {
          // Update both states in comparison mode
          updateState(state.mainState)
          updateState(state.comparisonState)
        } else {
          // Update specific state
          const targetState = isComparison ? state.comparisonState : state.mainState
          updateState(targetState)
        }
      }),

    setIsPlaying: (playing, isComparison = false) =>
      set((state) => {
        if (state.comparisonMode && isComparison === undefined) {
          // Update both states in comparison mode
          state.mainState.isPlaying = playing
          state.comparisonState.isPlaying = playing
        } else {
          // Update specific state
          const targetState = isComparison ? state.comparisonState : state.mainState
          targetState.isPlaying = playing
        }
      }),

    setSpeed: (speed, isComparison = false) =>
      set((state) => {
        const clampedSpeed = Math.max(100, Math.min(speed, 5000))
        
        if (state.comparisonMode && isComparison === undefined) {
          // Update both states in comparison mode
          state.mainState.speed = clampedSpeed
          state.comparisonState.speed = clampedSpeed
        } else {
          // Update specific state
          const targetState = isComparison ? state.comparisonState : state.mainState
          targetState.speed = clampedSpeed
        }
      }),

    setDataset: (data, isComparison = false) =>
      set((state) => {
        const updateState = (targetState: AlgorithmState) => {
          targetState.dataset = data
          targetState.algorithmSteps = []
          targetState.currentStepIndex = 0
          targetState.isPlaying = false
        }
        
        if (state.comparisonMode && isComparison === undefined) {
          // Update both states in comparison mode
          updateState(state.mainState)
          updateState(state.comparisonState)
        } else {
          // Update specific state
          const targetState = isComparison ? state.comparisonState : state.mainState
          updateState(targetState)
        }
      }),

    play: (isComparison = false) =>
      set((state) => {
        if (state.comparisonMode && isComparison === undefined) {
          // Update both states in comparison mode
          state.mainState.isPlaying = true
          state.comparisonState.isPlaying = true
        } else {
          // Update specific state
          const targetState = isComparison ? state.comparisonState : state.mainState
          targetState.isPlaying = true
        }
      }),

    pause: (isComparison = false) =>
      set((state) => {
        if (state.comparisonMode && isComparison === undefined) {
          // Update both states in comparison mode
          state.mainState.isPlaying = false
          state.comparisonState.isPlaying = false
        } else {
          // Update specific state
          const targetState = isComparison ? state.comparisonState : state.mainState
          targetState.isPlaying = false
        }
      }),

    nextStep: (isComparison = false) =>
      set((state) => {
        const updateState = (targetState: AlgorithmState) => {
          if (targetState.currentStepIndex < targetState.algorithmSteps.length - 1) {
            targetState.currentStepIndex = targetState.currentStepIndex + 1
          } else {
            // Auto-pause when reaching the end
            targetState.isPlaying = false
          }
        }
        
        if (state.comparisonMode && isComparison === undefined) {
          // Update both states in comparison mode
          updateState(state.mainState)
          updateState(state.comparisonState)
        } else {
          // Update specific state
          const targetState = isComparison ? state.comparisonState : state.mainState
          updateState(targetState)
        }
      }),

    prevStep: (isComparison = false) =>
      set((state) => {
        const updateState = (targetState: AlgorithmState) => {
          if (targetState.currentStepIndex > 0) {
            targetState.currentStepIndex = targetState.currentStepIndex - 1
          }
          // Pause when going backwards
          targetState.isPlaying = false
        }
        
        if (state.comparisonMode && isComparison === undefined) {
          // Update both states in comparison mode
          updateState(state.mainState)
          updateState(state.comparisonState)
        } else {
          // Update specific state
          const targetState = isComparison ? state.comparisonState : state.mainState
          updateState(targetState)
        }
      }),

    setComparisonMode: (enabled) =>
      set((state) => {
        state.comparisonMode = enabled
        
        // When enabling comparison mode, sync states
        if (enabled) {
          state.comparisonState = { ...state.mainState }
        }
      }),

    resetBothStates: () =>
      set((state) => {
        const resetState = (): AlgorithmState => ({
          algorithmSteps: [],
          currentStepIndex: 0,
          isPlaying: false,
          speed: 1000,
          dataset: [],
        })
        
        state.mainState = resetState()
        state.comparisonState = resetState()
        state.comparisonMode = false
      }),

    // Getter properties for component compatibility
    get algorithmSteps() {
      const state = get()
      return state.comparisonMode ? state.mainState.algorithmSteps : state.mainState.algorithmSteps
    },
    
    get currentStepIndex() {
      const state = get()
      return state.comparisonMode ? state.mainState.currentStepIndex : state.mainState.currentStepIndex
    },
    
    get isPlaying() {
      const state = get()
      return state.comparisonMode ? state.mainState.isPlaying : state.mainState.isPlaying
    },
    
    get speed() {
      const state = get()
      return state.comparisonMode ? state.mainState.speed : state.mainState.speed
    },
    
    get dataset() {
      const state = get()
      return state.comparisonMode ? state.mainState.dataset : state.mainState.dataset
    },
    
    get main() {
      const state = get()
      return state.mainState
    },
    
    get comparison() {
      const state = get()
      return state.comparisonState
    },
  }))
)

// Selector hooks for main state
export const useAlgorithmSteps = (isComparison = false) => 
  useStore((state) => isComparison ? state.comparisonState.algorithmSteps : state.mainState.algorithmSteps)

export const useCurrentStepIndex = (isComparison = false) => 
  useStore((state) => isComparison ? state.comparisonState.currentStepIndex : state.mainState.currentStepIndex)

export const useIsPlaying = (isComparison = false) => 
  useStore((state) => isComparison ? state.comparisonState.isPlaying : state.mainState.isPlaying)

export const useSpeed = (isComparison = false) => 
  useStore((state) => isComparison ? state.comparisonState.speed : state.mainState.speed)

export const useDataset = (isComparison = false) => 
  useStore((state) => isComparison ? state.comparisonState.dataset : state.mainState.dataset)

export const useCurrentStep = (isComparison = false) => useStore((state) => {
  const targetState = isComparison ? state.comparisonState : state.mainState
  return targetState.algorithmSteps[targetState.currentStepIndex] || null
})

// Comparison mode selectors
export const useComparisonMode = () => useStore((state) => state.comparisonMode)
export const useMainState = () => useStore((state) => state.mainState)
export const useComparisonState = () => useStore((state) => state.comparisonState)

// Combined state selectors for comparison mode
export const useBothStates = () => useStore((state) => ({
  mainState: state.mainState,
  comparisonState: state.comparisonState,
  comparisonMode: state.comparisonMode,
}))

// Action selectors (updated to work with dual state)
export const useStoreActions = () => useStore((state) => ({
  setAlgorithmSteps: state.setAlgorithmSteps,
  setCurrentStepIndex: state.setCurrentStepIndex,
  setIsPlaying: state.setIsPlaying,
  setSpeed: state.setSpeed,
  setDataset: state.setDataset,
  play: state.play,
  pause: state.pause,
  nextStep: state.nextStep,
  prevStep: state.prevStep,
  setComparisonMode: state.setComparisonMode,
  resetBothStates: state.resetBothStates,
}))
