import axios from 'axios'
import { AlgorithmStep } from '../store/useStore'

/**
 * Context object for algorithm explanation requests
 */
export interface AlgorithmExplanationContext {
  algorithmName: string
  currentStep: AlgorithmStep
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
  }
}

/**
 * Configuration for the Ollama service
 */
const OLLAMA_CONFIG = {
  baseURL: 'http://localhost:11434',
  model: 'llama3.2',
  timeout: 30000, // 30 seconds
  options: {
    temperature: 0.7,
    top_p: 0.9,
    top_k: 40,
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
  const { algorithmName, currentStep } = context
  
  let message = `Algorithm: ${algorithmName}\n`
  message += `Current Step: ${currentStep.description}\n`
  message += `Array State: [${currentStep.data.join(', ')}]\n`
  
  if (currentStep.comparingElements && currentStep.comparingElements.length > 0) {
    const elements = currentStep.comparingElements.map(i => currentStep.data[i])
    message += `Comparing elements: ${elements.join(' and ')} at positions ${currentStep.comparingElements.join(' and ')}\n`
  }
  
  if (currentStep.swappingElements && currentStep.swappingElements.length > 0) {
    const elements = currentStep.swappingElements.map(i => currentStep.data[i])
    message += `Swapping elements: ${elements.join(' and ')} at positions ${currentStep.swappingElements.join(' and ')}\n`
  }
  
  if (currentStep.highlightedElements && currentStep.highlightedElements.length > 0) {
    const elements = currentStep.highlightedElements.map(i => currentStep.data[i])
    message += `Highlighted elements: ${elements.join(', ')} at positions ${currentStep.highlightedElements.join(', ')}\n`
  }
  
  message += '\nPlease explain what is happening in this step and why the algorithm is performing this operation.'
  
  return message
}

/**
 * Makes a request to the Ollama API for algorithm explanation
 */
export async function getAlgorithmExplanation(
  context: AlgorithmExplanationContext
): Promise<string> {
  try {
    // Construct the request payload
    const requestBody: OllamaRequest = {
      model: OLLAMA_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: constructUserMessage(context)
        }
      ],
      stream: false,
      options: OLLAMA_CONFIG.options
    }

    // Make the API request
    const response = await axios.post<OllamaResponse>(
      `${OLLAMA_CONFIG.baseURL}/api/chat`,
      requestBody,
      {
        timeout: OLLAMA_CONFIG.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    // Extract and return the explanation
    const explanation = response.data.message.content.trim()
    
    if (!explanation) {
      throw new Error('Empty response from Ollama API')
    }
    
    return explanation

  } catch (error) {
    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        throw new Error(
          'Unable to connect to Ollama. Please ensure Ollama is running on localhost:11434'
        )
      }
      
      if (error.response?.status === 404) {
        throw new Error(
          `Model '${OLLAMA_CONFIG.model}' not found. Please ensure the model is installed in Ollama.`
        )
      }
      
      if (error.response?.status >= 500) {
        throw new Error(
          'Ollama server error. Please check your Ollama installation.'
        )
      }
      
      throw new Error(
        `API request failed: ${error.response?.statusText || error.message}`
      )
    }
    
    // Re-throw unexpected errors
    throw error
  }
}

/**
 * Checks if Ollama is available and the model is accessible
 */
export async function checkOllamaAvailability(): Promise<boolean> {
  try {
    const response = await axios.get(`${OLLAMA_CONFIG.baseURL}/api/tags`, {
      timeout: 5000
    })
    
    // Check if our model is available
    const models = response.data.models || []
    const isModelAvailable = models.some((model: any) => 
      model.name.includes(OLLAMA_CONFIG.model)
    )
    
    return isModelAvailable
  } catch {
    return false
  }
}

/**
 * Gets available models from Ollama
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await axios.get(`${OLLAMA_CONFIG.baseURL}/api/tags`, {
      timeout: 5000
    })
    
    const models = response.data.models || []
    return models.map((model: any) => model.name)
  } catch {
    return []
  }
}
