import { useState, useEffect } from 'react'
import { useAlgorithmSteps, useCurrentStepIndex, useIsPlaying } from '../store/useStore'
import { ollamaService } from '../services/ollamaService'
import type { AlgorithmExplanationContext } from '../services/ollamaService'
import type { AlgorithmStep as StoreAlgorithmStep } from '../store/useStore'

/**
 * Type conversion utility to convert store AlgorithmStep to ollamaService AlgorithmStep
 */
const convertStoreStepToOllamaStep = (storeStep: StoreAlgorithmStep) => {
  return {
    type: 'compare' as const, // Default type, could be enhanced based on storeStep.description
    indices: storeStep.comparingElements || [],
    array: storeStep.data || [],
    description: storeStep.description || ''
  }
}

/**
 * ExplanationPanel Component
 * 
 * Provides AI-powered explanations for algorithm steps using Ollama service.
 * Displays step-by-step breakdown of algorithm execution with contextual insights.
 */
export const ExplanationPanel = () => {
  const steps = useAlgorithmSteps()
  const currentStepIndex = useCurrentStepIndex()
  const isAnimating = useIsPlaying()
  const selectedAlgorithm = 'Algorithm' // Default algorithm name
  
  const [explanation, setExplanation] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOllamaAvailable, setIsOllamaAvailable] = useState<boolean | null>(null)

  // Check Ollama availability on component mount
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        await ollamaService.initialize()
        const available = ollamaService.isAvailable()
        setIsOllamaAvailable(available)
        if (!available) {
          setError('Ollama service is not available. Please ensure Ollama is running.')
        }
      } catch (err) {
        console.error('Error checking Ollama availability:', err)
        setIsOllamaAvailable(false)
        setError('Failed to connect to Ollama service.')
      }
    }

    checkAvailability()
  }, [])

  // Generate explanation when current step changes
  useEffect(() => {
    if (
      isOllamaAvailable && 
      currentStepIndex >= 0 && 
      steps.length > 0 && 
      currentStepIndex < steps.length &&
      selectedAlgorithm &&
      !isAnimating // Don't generate explanations during animation
    ) {
      generateExplanation()
    }
  }, [currentStepIndex, steps, selectedAlgorithm, isOllamaAvailable, isAnimating])

  /**
   * Generates AI explanation for the current algorithm step
   */
  const generateExplanation = async () => {
    if (currentStepIndex < 0 || currentStepIndex >= steps.length) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const currentStep = steps[currentStepIndex]
      if (!currentStep) {
        setError('No step data available')
        return
      }
      
      const previousSteps = steps.slice(0, currentStepIndex)
      
      // Convert store step format to ollama service format
      const ollamaCurrentStep = convertStoreStepToOllamaStep(currentStep)
      const ollmaPreviousSteps = previousSteps.map(convertStoreStepToOllamaStep)

      const context: AlgorithmExplanationContext = {
        algorithmName: selectedAlgorithm,
        currentStep: ollamaCurrentStep,
        previousSteps: ollmaPreviousSteps,
        totalSteps: steps.length,
        stepIndex: currentStepIndex
      }

      const result = await ollamaService.explainStep(context)
      setExplanation(result)
    } catch (err) {
      console.error('Error generating explanation:', err)
      setError(`Failed to generate explanation: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Manually refresh the explanation for the current step
   */
  const refreshExplanation = () => {
    if (isOllamaAvailable && !isLoading) {
      generateExplanation()
    }
  }

  /**
   * Render loading state
   */
  if (isOllamaAvailable === null) {
    return (
      <div className="explanation-panel">
        <div className="panel-header">
          <h3>Algorithm Explanation</h3>
        </div>
        <div className="panel-content">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Checking AI service availability...</p>
          </div>
        </div>
      </div>
    )
  }

  /**
   * Render unavailable state
   */
  if (!isOllamaAvailable) {
    return (
      <div className="explanation-panel">
        <div className="panel-header">
          <h3>Algorithm Explanation</h3>
          <span className="status-indicator offline">Offline</span>
        </div>
        <div className="panel-content">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h4>AI Service Unavailable</h4>
            <p>
              The AI explanation service is currently offline. 
              Please ensure Ollama is running on your system.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="retry-button"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    )
  }

  /**
   * Render main explanation panel
   */
  return (
    <div className="explanation-panel">
      <div className="panel-header">
        <h3>Algorithm Explanation</h3>
        <div className="header-controls">
          <span className="status-indicator online">AI Ready</span>
          <button 
            onClick={refreshExplanation}
            disabled={isLoading || !selectedAlgorithm}
            className="refresh-button"
            title="Refresh explanation"
          >
            🔄
          </button>
        </div>
      </div>

      <div className="panel-content">
        {/* Step Information */}
        {steps.length > 0 && currentStepIndex >= 0 && (
          <div className="step-info">
            <div className="step-counter">
              Step {currentStepIndex + 1} of {steps.length}
            </div>
            {selectedAlgorithm && (
              <div className="algorithm-name">
                {selectedAlgorithm.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            )}
          </div>
        )}

        {/* Explanation Content */}
        <div className="explanation-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Generating explanation...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">❌</div>
              <p className="error-message">{error}</p>
              <button onClick={refreshExplanation} className="retry-button">
                Try Again
              </button>
            </div>
          ) : explanation ? (
            <div className="explanation-text">
              <div className="explanation-content-inner">
                {explanation.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="placeholder-state">
              <div className="placeholder-icon">🤖</div>
              <p>
                {steps.length === 0 
                  ? "Load an algorithm to see AI-powered explanations"
                  : isAnimating
                  ? "Animation in progress..."
                  : "Select a step to view explanation"
                }
              </p>
            </div>
          )}
        </div>

        {/* Algorithm Overview Button */}
        {selectedAlgorithm && !isLoading && (
          <div className="panel-footer">
            <button 
              onClick={async () => {
                setIsLoading(true)
                try {
                  const overview = await ollamaService.getAlgorithmOverview(selectedAlgorithm)
                  setExplanation(overview)
                } catch (err) {
                  setError(`Failed to get overview: ${err instanceof Error ? err.message : 'Unknown error'}`)
                } finally {
                  setIsLoading(false)
                }
              }}
              className="overview-button"
            >
              📖 Algorithm Overview
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExplanationPanel
