import { create } from 'zustand';

interface AlgorithmStep {
  step: number;
  description: string;
  data: any;
  highlight?: number[];
}

interface AlgorithmState {
  dataset: number[];
  algorithmSteps: AlgorithmStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  algorithm: string;
  
  // Actions
  setDataset: (data: number[]) => void;
  setAlgorithmSteps: (steps: AlgorithmStep[]) => void;
  setCurrentStep: (step: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setSpeed: (speed: number) => void;
  setAlgorithm: (algorithm: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

export const useAlgorithmStore = create<AlgorithmState>((set, get) => ({
  dataset: [64, 34, 25, 12, 22, 11, 90],
  algorithmSteps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 1000,
  algorithm: 'none',

  setDataset: (data) => set({ dataset: data }),
  setAlgorithmSteps: (steps) => set({ algorithmSteps: steps, currentStep: 0 }),
  setCurrentStep: (step) => set({ currentStep: step }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setSpeed: (speed) => set({ speed }),
  setAlgorithm: (algorithm) => set({ algorithm }),
  
  nextStep: () => {
    const { currentStep, algorithmSteps } = get();
    if (currentStep < algorithmSteps.length - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },
  
  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },
  
  reset: () => set({ 
    currentStep: 0, 
    isPlaying: false,
    algorithmSteps: []
  })
}));
