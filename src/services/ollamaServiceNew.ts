import axios from 'axios'
import type { AlgorithmStep } from '../utils/codeExecutor'

/**
 * Context object for algorithm explanation requests
 */
export interface AlgorithmExplanationContext {
  algorithmName: string
  currentStep: AlgorithmStep
  previousSteps?: AlgorithmStep[]
  totalSteps?: number
  stepIndex?: number
}

/**
 * Ollama API response structure
 */
interface OllamaResponse {
  message: {
    role: string
    content: string
  }
  done: boolean
  total_duration?: number
  load_duration?: number
  prompt_eval_count?: number
  prompt_eval_duration?: number
  eval_count?: number
  eval_duration?: number
}

/**
 * Ollama API request structure
 */
interface OllamaRequest {
  model: string
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  stream?: boolean
  options?: {
    temperature?: number
    top_p?: number
    top_k?: number
    max_tokens?: number
  }
}

/**
 * Configuration for the Ollama service
 */
const OLLAMA_CONFIG = {
  baseURL: 'http://localhost:11434',
  model: 'llama3.1:latest', // Default model, can be changed
  timeout: 30000, // 30 seconds timeout
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  options: {
    temperature: 0.7,
    top_p: 0.9,
    top_k: 40,
    max_tokens: 500
  }
}

/**
 * System prompt defining the AI's persona and capabilities
 */
const SYSTEM_PROMPT = `You are a knowledgeable Computer Science professor specializing in algorithms and data structures. Your role is to provide clear, educational explanations of algorithm steps that help students understand what's happening at each stage of execution.

Guidelines for your responses:
- Keep explanations concise but informative (2-3 sentences max)
- Use technical terminology appropriately but explain complex concepts
- Focus on the specific operation happening in the current step
- Explain WHY the algorithm is performing this action
- When applicable, mention the impact on time/space complexity
- Use encouraging and educational tone
- Avoid overly verbose explanations

You will receive information about the current step of an algorithm execution, including:
- The algorithm name
- Current array state
- Elements being compared, swapped, or highlighted
- Step description

Provide an explanation that helps students understand the reasoning behind the current operation.`

/**
 * Constructs a user message from the algorithm context
 */
function constructUserMessage(context: AlgorithmExplanationContext): string {
  const { algorithmName, currentStep, stepIndex, totalSteps } = context
  
  let message = `Algorithm: ${algorithmName}\n`
  message += `Current Step: ${currentStep.description}\n`
  
  if (currentStep.array && Array.isArray(currentStep.array)) {
    message += `Array State: [${currentStep.array.join(', ')}]\n`
  }
  
  if (currentStep.indices && currentStep.indices.length > 0) {
    message += `Active Indices: ${currentStep.indices.join(', ')}\n`
  }
  
  message += `Operation Type: ${currentStep.type}\n`
  
  if (currentStep.metadata) {
    if (currentStep.metadata.comparisons !== undefined) {
      message += `Comparisons so far: ${currentStep.metadata.comparisons}\n`
    }
    if (currentStep.metadata.swaps !== undefined) {
      message += `Swaps so far: ${currentStep.metadata.swaps}\n`
    }
  }
  
  if (stepIndex !== undefined && totalSteps !== undefined) {
    message += `Progress: Step ${stepIndex + 1} of ${totalSteps}\n`
  }
  
  message += `\nPlease explain what is happening in this step and why.`
  
  return message
}

/**
 * Validates if the Ollama service is available
 */
async function checkOllamaHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${OLLAMA_CONFIG.baseURL}/api/tags`, {
      timeout: 5000
    })
    return response.status === 200
  } catch (error) {
    console.warn('Ollama health check failed:', error)
    return false
  }
}

/**
 * Lists available models from Ollama
 */
async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await axios.get(`${OLLAMA_CONFIG.baseURL}/api/tags`)
    return response.data.models?.map((model: { name: string }) => model.name) || []
  } catch (error) {
    console.error('Failed to fetch available models:', error)
    return []
  }
}

/**
 * Makes a request to the Ollama API with retry logic
 */
async function makeOllamaRequest(request: OllamaRequest): Promise<string> {
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= OLLAMA_CONFIG.retryAttempts; attempt++) {
    try {
      const response = await axios.post<OllamaResponse>(
        `${OLLAMA_CONFIG.baseURL}/api/chat`,
        request,
        {
          timeout: OLLAMA_CONFIG.timeout,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (response.data.message?.content) {
        return response.data.message.content
      } else {
        throw new Error('Empty response from Ollama')
      }
    } catch (error) {
      lastError = error as Error
      console.warn(`Ollama request attempt ${attempt} failed:`, error)
      
      if (attempt < OLLAMA_CONFIG.retryAttempts) {
        await new Promise(resolve => setTimeout(resolve, OLLAMA_CONFIG.retryDelay * attempt))
      }
    }
  }
  
  throw lastError || new Error('Ollama request failed after all retries')
}

/**
 * Streams a response from Ollama API
 */
async function* streamOllamaResponse(request: OllamaRequest): AsyncGenerator<string> {
  try {
    const response = await fetch(`${OLLAMA_CONFIG.baseURL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...request, stream: true })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('Response body is not readable')
    }
    
    const decoder = new TextDecoder()
    let buffer = ''
    
    try {
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        
        // Process complete lines
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line)
              if (data.message?.content) {
                yield data.message.content
              }
              if (data.done) {
                return
              }
            } catch (e) {
              console.warn('Failed to parse streaming response line:', line)
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  } catch (error) {
    console.error('Streaming request failed:', error)
    throw error
  }
}

/**
 * Main service class for interacting with Ollama
 */
export class OllamaService {
  private isHealthy: boolean = false
  private availableModels: string[] = []
  
  /**
   * Initialize the service and check health
   */
  async initialize(): Promise<void> {
    this.isHealthy = await checkOllamaHealth()
    if (this.isHealthy) {
      this.availableModels = await getAvailableModels()
    }
  }
  
  /**
   * Check if the service is available
   */
  isAvailable(): boolean {
    return this.isHealthy
  }
  
  /**
   * Get available models
   */
  getModels(): string[] {
    return this.availableModels
  }
  
  /**
   * Get explanation for a specific algorithm step
   */
  async explainStep(context: AlgorithmExplanationContext): Promise<string> {
    if (!this.isHealthy) {
      return 'AI explanation service is not available. Make sure Ollama is running on localhost:11434.'
    }
    
    const userMessage = constructUserMessage(context)
    
    const request: OllamaRequest = {
      model: OLLAMA_CONFIG.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      stream: false,
      options: OLLAMA_CONFIG.options
    }
    
    try {
      return await makeOllamaRequest(request)
    } catch (error) {
      console.error('Failed to get step explanation:', error)
      return `Unable to generate explanation: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
  
  /**
   * Stream explanation for a specific algorithm step
   */
  async* explainStepStreaming(context: AlgorithmExplanationContext): AsyncGenerator<string> {
    if (!this.isHealthy) {
      yield 'AI explanation service is not available. Make sure Ollama is running on localhost:11434.'
      return
    }
    
    const userMessage = constructUserMessage(context)
    
    const request: OllamaRequest = {
      model: OLLAMA_CONFIG.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      stream: true,
      options: OLLAMA_CONFIG.options
    }
    
    try {
      yield* streamOllamaResponse(request)
    } catch (error) {
      console.error('Failed to stream step explanation:', error)
      yield `Unable to generate explanation: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
  
  /**
   * Get algorithm overview and complexity analysis
   */
  async getAlgorithmOverview(algorithmName: string): Promise<string> {
    if (!this.isHealthy) {
      return 'AI explanation service is not available.'
    }
    
    const userMessage = `Please provide a brief overview of the ${algorithmName} algorithm, including its time and space complexity, best/worst case scenarios, and when it's typically used.`
    
    const request: OllamaRequest = {
      model: OLLAMA_CONFIG.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      stream: false,
      options: OLLAMA_CONFIG.options
    }
    
    try {
      return await makeOllamaRequest(request)
    } catch (error) {
      console.error('Failed to get algorithm overview:', error)
      return `Unable to generate overview: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Create and export a singleton instance
export const ollamaService = new OllamaService()

// Export convenience functions
export const explainAlgorithmStep = (context: AlgorithmExplanationContext) => 
  ollamaService.explainStep(context)

export const streamAlgorithmStep = (context: AlgorithmExplanationContext) => 
  ollamaService.explainStepStreaming(context)

export const getAlgorithmOverview = (algorithmName: string) => 
  ollamaService.getAlgorithmOverview(algorithmName)
