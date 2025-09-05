import axios from 'axios'
import type { AlgorithmStep } from '../utils/codeExecutor'
import { createOptimizedPrompt, getRecommendedAnalysisType, type AnalysisType, type CodeContext } from './promptOptimizer'

/**
 * AI Usage Statistics
 */
export interface AIUsageStats {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  totalTokensUsed: number
  totalDuration: number
  modelUsage: Record<string, number>
  lastUsed: Date | null
  sessionStart: Date
}

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
  preferredModels: ['codellama:7b', 'llama3.1:8b', 'llama3.1:latest', 'codellama:latest'], // Priority order
  defaultModel: 'codellama:7b',
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
 * System prompt defining the AI's persona and capabilities for algorithm visualization
 */
const SYSTEM_PROMPT = `You are an expert Computer Science professor and algorithm analyst specializing in data structures, algorithms, and code optimization. You are integrated into "Algorithmic Insights" - an interactive algorithm visualization platform.

Your role is to:
1. **Analyze algorithm code** submitted by students and developers
2. **Provide educational explanations** that help users understand algorithmic concepts
3. **Identify optimization opportunities** and suggest improvements
4. **Explain time/space complexity** in clear, understandable terms
5. **Detect potential bugs or issues** in algorithm implementations

**Analysis Guidelines:**
- Focus on algorithm efficiency (Big O notation analysis)
- Identify data structure usage and suggest alternatives when beneficial
- Point out common algorithmic patterns (sorting, searching, graph traversal, etc.)
- Explain step-by-step what the algorithm does
- Suggest code improvements for readability and performance
- Highlight any potential edge cases or bugs
- Keep explanations educational but concise (aim for 3-5 key points)

**Code Context:**
- Primary focus: Sorting algorithms, searching algorithms, graph algorithms, tree operations
- Languages: JavaScript, Python, Java, C++, TypeScript
- Target audience: Students learning algorithms and developers optimizing code
- Platform features: Step-by-step visualization, mystical UI effects, real-time metrics

**Response Format:**
Structure your analysis as:
🔍 **Algorithm Analysis:**
📊 **Complexity:** Time: O(?) | Space: O(?)
⚡ **Optimizations:** [if any]
🐛 **Issues Found:** [if any]
💡 **Educational Notes:** [key learning points]

Be encouraging and educational in tone. Help users learn and improve their algorithmic thinking.`

/**
 * Constructs a user message from the algorithm context for step-by-step explanations
 */
function constructUserMessage(context: AlgorithmExplanationContext): string {
  const { algorithmName, currentStep, stepIndex, totalSteps } = context
  
  let message = `**ALGORITHM VISUALIZATION STEP EXPLANATION**

**Algorithm**: ${algorithmName}
**Current Step**: ${currentStep.description}
`
  
  if (currentStep.array && Array.isArray(currentStep.array)) {
    message += `**Array State**: [${currentStep.array.join(', ')}]\n`
  }
  
  if (currentStep.indices && currentStep.indices.length > 0) {
    message += `**Active Indices**: ${currentStep.indices.join(', ')}\n`
  }
  
  message += `**Operation Type**: ${currentStep.type}\n`
  
  if (currentStep.metadata) {
    if (currentStep.metadata.comparisons !== undefined) {
      message += `**Comparisons Made**: ${currentStep.metadata.comparisons}\n`
    }
    if (currentStep.metadata.swaps !== undefined) {
      message += `**Swaps Made**: ${currentStep.metadata.swaps}\n`
    }
  }
  
  if (stepIndex !== undefined && totalSteps !== undefined) {
    message += `**Progress**: Step ${stepIndex + 1} of ${totalSteps}\n`
  }
  
  message += `

**EXPLANATION REQUEST**:
Please provide a clear, educational explanation of what's happening in this algorithm step. Focus on:
1. What operation is being performed and why
2. How this step contributes to the overall algorithm goal
3. Any key algorithmic concepts demonstrated
4. What the user should understand from this visualization step

Keep the explanation engaging and suitable for the magical/mystical theme of our platform while remaining educational.`
  
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
  private selectedModel: string = OLLAMA_CONFIG.defaultModel
  private usageStats: AIUsageStats
  
  constructor() {
    this.usageStats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalTokensUsed: 0,
      totalDuration: 0,
      modelUsage: {},
      lastUsed: null,
      sessionStart: new Date()
    }
  }
  
  /**
   * Initialize the service and check health
   */
  async initialize(): Promise<void> {
    console.log('🔄 Initializing Ollama service...')
    this.isHealthy = await checkOllamaHealth()
    
    if (this.isHealthy) {
      this.availableModels = await getAvailableModels()
      console.log('✅ Ollama is running. Available models:', this.availableModels)
      
      // Select the best available model
      this.selectedModel = this.selectBestModel()
      console.log('🎯 Selected model:', this.selectedModel)
      
      if (!this.selectedModel) {
        console.warn('⚠️ No suitable models found. Please install a recommended model.')
        this.isHealthy = false
      }
    } else {
      console.error('❌ Ollama is not running or not accessible at localhost:11434')
    }
  }
  
  /**
   * Select the best available model from preferred list
   */
  private selectBestModel(): string {
    for (const preferredModel of OLLAMA_CONFIG.preferredModels) {
      if (this.availableModels.includes(preferredModel)) {
        return preferredModel
      }
    }
    
    // If no preferred model is available, use the first available one
    if (this.availableModels.length > 0) {
      return this.availableModels[0]!
    }
    
    return OLLAMA_CONFIG.defaultModel
  }
  
  /**
   * Update usage statistics
   */
  private updateUsageStats(success: boolean, duration: number = 0, tokens: number = 0): void {
    this.usageStats.totalRequests++
    this.usageStats.lastUsed = new Date()
    this.usageStats.totalDuration += duration
    this.usageStats.totalTokensUsed += tokens
    
    if (success) {
      this.usageStats.successfulRequests++
    } else {
      this.usageStats.failedRequests++
    }
    
    // Track model usage
    if (!this.usageStats.modelUsage[this.selectedModel]) {
      this.usageStats.modelUsage[this.selectedModel] = 0
    }
    this.usageStats.modelUsage[this.selectedModel] = (this.usageStats.modelUsage[this.selectedModel] || 0) + 1
  }
  
  /**
   * Check if the service is available
   */
  isAvailable(): boolean {
    return this.isHealthy && this.selectedModel !== ''
  }
  
  /**
   * Get available models
   */
  getModels(): string[] {
    return this.availableModels
  }
  
  /**
   * Get current selected model
   */
  getCurrentModel(): string {
    return this.selectedModel
  }
  
  /**
   * Get usage statistics
   */
  getUsageStats(): AIUsageStats {
    return { ...this.usageStats }
  }
  
  /**
   * Reset usage statistics
   */
  resetUsageStats(): void {
    this.usageStats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalTokensUsed: 0,
      totalDuration: 0,
      modelUsage: {},
      lastUsed: null,
      sessionStart: new Date()
    }
  }
  
  /**
   * Get explanation for a specific algorithm step
   */
  async explainStep(context: AlgorithmExplanationContext): Promise<string> {
    if (!this.isAvailable()) {
      const message = !this.isHealthy 
        ? 'AI explanation service is not available. Make sure Ollama is running on localhost:11434.'
        : 'No suitable AI model is installed. Please install CodeLlama or Llama3 models.'
      this.updateUsageStats(false)
      return message
    }
    
    const startTime = Date.now()
    const userMessage = constructUserMessage(context)
    
    const request: OllamaRequest = {
      model: this.selectedModel,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      stream: false,
      options: OLLAMA_CONFIG.options
    }
    
    try {
      const response = await makeOllamaRequest(request)
      const duration = Date.now() - startTime
      this.updateUsageStats(true, duration, response.length)
      return response
    } catch (error) {
      const duration = Date.now() - startTime
      this.updateUsageStats(false, duration)
      console.error('Failed to get step explanation:', error)
      return `Unable to generate explanation: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
  
  /**
   * Stream explanation for a specific algorithm step
   */
  async* explainStepStreaming(context: AlgorithmExplanationContext): AsyncGenerator<string> {
    if (!this.isAvailable()) {
      const message = !this.isHealthy 
        ? 'AI explanation service is not available. Make sure Ollama is running on localhost:11434.'
        : 'No suitable AI model is installed. Please install CodeLlama or Llama3 models.'
      this.updateUsageStats(false)
      yield message
      return
    }
    
    const startTime = Date.now()
    const userMessage = constructUserMessage(context)
    
    const request: OllamaRequest = {
      model: this.selectedModel,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      stream: true,
      options: OLLAMA_CONFIG.options
    }
    
    try {
      let totalContent = ''
      for await (const chunk of streamOllamaResponse(request)) {
        totalContent += chunk
        yield chunk
      }
      const duration = Date.now() - startTime
      this.updateUsageStats(true, duration, totalContent.length)
    } catch (error) {
      const duration = Date.now() - startTime
      this.updateUsageStats(false, duration)
      console.error('Failed to stream step explanation:', error)
      yield `Unable to generate explanation: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
  
  /**
   * Get algorithm overview and complexity analysis
   */
  async getAlgorithmOverview(algorithmName: string): Promise<string> {
    if (!this.isAvailable()) {
      const message = !this.isHealthy 
        ? 'AI explanation service is not available.'
        : 'No suitable AI model is installed.'
      this.updateUsageStats(false)
      return message
    }
    
    const startTime = Date.now()
    const userMessage = `Please provide a brief overview of the ${algorithmName} algorithm, including its time and space complexity, best/worst case scenarios, and when it's typically used.`
    
    const request: OllamaRequest = {
      model: this.selectedModel,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      stream: false,
      options: OLLAMA_CONFIG.options
    }
    
    try {
      const response = await makeOllamaRequest(request)
      const duration = Date.now() - startTime
      this.updateUsageStats(true, duration, response.length)
      return response
    } catch (error) {
      const duration = Date.now() - startTime
      this.updateUsageStats(false, duration)
      console.error('Failed to get algorithm overview:', error)
      return `Unable to generate overview: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
  
  /**
   * Optimized code analysis with specific prompts for faster responses
   */
  async analyzeCodeOptimized(
    code: string, 
    language: string, 
    analysisType: AnalysisType = 'detailed-analysis',
    options?: Partial<CodeContext>
  ): Promise<string> {
    if (!this.isAvailable()) {
      const message = !this.isHealthy 
        ? 'AI code analysis service is not available.'
        : 'No suitable AI model is installed.'
      this.updateUsageStats(false)
      return message
    }
    
    const startTime = Date.now()
    
    // Generate optimized prompt
    const optimizedPrompt = createOptimizedPrompt(analysisType, code, language, {
      userLevel: 'intermediate',
      ...options
    })
    
    const request: OllamaRequest = {
      model: this.selectedModel,
      messages: [
        { role: 'system', content: optimizedPrompt.systemPrompt },
        { role: 'user', content: optimizedPrompt.userPrompt }
      ],
      stream: false,
      options: optimizedPrompt.options
    }
    
    try {
      const response = await makeOllamaRequest(request)
      const duration = Date.now() - startTime
      this.updateUsageStats(true, duration, response.length)
      return response
    } catch (error) {
      const duration = Date.now() - startTime
      this.updateUsageStats(false, duration)
      console.error('Failed to analyze code:', error)
      return `Unable to analyze code: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  /**
   * Quick complexity analysis - Fastest response
   */
  async getQuickComplexity(code: string, language: string): Promise<string> {
    return this.analyzeCodeOptimized(code, language, 'quick-complexity')
  }

  /**
   * Bug detection analysis
   */
  async detectBugs(code: string, language: string): Promise<string> {
    return this.analyzeCodeOptimized(code, language, 'bug-detection')
  }

  /**
   * Optimization suggestions
   */
  async getOptimizationSuggestions(code: string, language: string): Promise<string> {
    return this.analyzeCodeOptimized(code, language, 'optimization-suggestions')
  }

  /**
   * Educational explanation for students
   */
  async getEducationalExplanation(
    code: string, 
    language: string, 
    userLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ): Promise<string> {
    return this.analyzeCodeOptimized(code, language, 'educational-explanation', { userLevel })
  }

  /**
   * Algorithm identification
   */
  async identifyAlgorithm(code: string, language: string): Promise<string> {
    return this.analyzeCodeOptimized(code, language, 'algorithm-identification')
  }

  /**
   * Auto-analyze with recommended analysis types
   */
  async autoAnalyze(code: string, language: string): Promise<{ type: AnalysisType; result: string }[]> {
    const recommendedTypes = getRecommendedAnalysisType(code, language)
    const results: { type: AnalysisType; result: string }[] = []
    
    // Run analyses in parallel for speed
    const analysisPromises = recommendedTypes.slice(0, 3).map(async (type) => {
      const result = await this.analyzeCodeOptimized(code, language, type)
      return { type, result }
    })
    
    const analysisResults = await Promise.allSettled(analysisPromises)
    
    for (const result of analysisResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value)
      }
    }
    
    return results
  }
  async analyzeCode(code: string, language: string): Promise<string> {
    if (!this.isAvailable()) {
      const message = !this.isHealthy 
        ? 'AI code analysis service is not available.'
        : 'No suitable AI model is installed.'
      this.updateUsageStats(false)
      return message
    }
    
    const startTime = Date.now()
    
    // Create specialized prompt for algorithm visualization platform
    const userMessage = `Please analyze this ${language} code for the Algorithmic Insights visualization platform:

**CODE TO ANALYZE:**
\`\`\`${language}
${code}
\`\`\`

**ANALYSIS REQUIREMENTS:**
1. **Algorithm Identification**: What algorithm/pattern is this implementing?
2. **Time & Space Complexity**: Provide Big O analysis with explanation
3. **Visualization Compatibility**: How well would this work in a step-by-step visualizer?
4. **Code Quality**: Are there any issues, bugs, or improvements needed?
5. **Educational Value**: What key concepts does this demonstrate?
6. **Optimization Opportunities**: Any performance improvements possible?

**CONTEXT:**
- This code will be executed in a JavaScript environment
- It should work with arrays of numbers for visualization
- The platform shows step-by-step algorithm execution
- Target audience: Students and developers learning algorithms
- Platform supports mystical/magical UI themes

Please provide a comprehensive but concise analysis following the response format guidelines.`
    
    const request: OllamaRequest = {
      model: this.selectedModel,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage }
      ],
      stream: false,
      options: {
        ...OLLAMA_CONFIG.options,
        max_tokens: 1000, // Allow longer responses for detailed analysis
        temperature: 0.3  // Lower temperature for more focused analysis
      }
    }
    
    try {
      const response = await makeOllamaRequest(request)
      const duration = Date.now() - startTime
      this.updateUsageStats(true, duration, response.length)
      return response
    } catch (error) {
      const duration = Date.now() - startTime
      this.updateUsageStats(false, duration)
      console.error('Failed to analyze code:', error)
      return `Unable to analyze code: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  /**
   * Test AI connection with a simple algorithm analysis
   */
  async testConnection(): Promise<{ success: boolean; message: string; model: string }> {
    if (!this.isAvailable()) {
      return {
        success: false,
        message: 'AI service is not available. Please ensure Ollama is running with a suitable model.',
        model: 'None'
      }
    }

    const startTime = Date.now()
    const testCode = `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`

    try {
      const response = await this.analyzeCode(testCode, 'javascript')
      const duration = Date.now() - startTime
      
      if (response && response.length > 10 && !response.includes('Unable to')) {
        return {
          success: true,
          message: `AI connection successful! Response received in ${duration}ms.`,
          model: this.selectedModel
        }
      } else {
        return {
          success: false,
          message: 'AI responded but analysis appears incomplete.',
          model: this.selectedModel
        }
      }
    } catch (error) {
      return {
        success: false,
        message: `AI connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        model: this.selectedModel
      }
    }
  }
}

// Create and export a singleton instance
export const ollamaService = new OllamaService()

// Initialize the service
ollamaService.initialize().catch(console.error)

// Export convenience functions
export const explainAlgorithmStep = (context: AlgorithmExplanationContext) => 
  ollamaService.explainStep(context)

export const streamAlgorithmStep = (context: AlgorithmExplanationContext) => 
  ollamaService.explainStepStreaming(context)

export const getAlgorithmOverview = (algorithmName: string) => 
  ollamaService.getAlgorithmOverview(algorithmName)

export const analyzeCode = (code: string, language: string) => 
  ollamaService.analyzeCode(code, language)

export const getAIUsageStats = () => 
  ollamaService.getUsageStats()

export const resetAIUsageStats = () => 
  ollamaService.resetUsageStats()

export const isAIAvailable = () => 
  ollamaService.isAvailable()

export const getCurrentAIModel = () => 
  ollamaService.getCurrentModel()

export const getAvailableAIModels = () => 
  ollamaService.getModels()

export const testAIConnection = () => 
  ollamaService.testConnection()

// Optimized analysis functions
export const analyzeCodeOptimized = (code: string, language: string, analysisType?: AnalysisType, options?: Partial<CodeContext>) =>
  ollamaService.analyzeCodeOptimized(code, language, analysisType, options)

export const getQuickComplexity = (code: string, language: string) =>
  ollamaService.getQuickComplexity(code, language)

export const detectBugs = (code: string, language: string) =>
  ollamaService.detectBugs(code, language)

export const getOptimizationSuggestions = (code: string, language: string) =>
  ollamaService.getOptimizationSuggestions(code, language)

export const getEducationalExplanation = (code: string, language: string, userLevel?: 'beginner' | 'intermediate' | 'advanced') =>
  ollamaService.getEducationalExplanation(code, language, userLevel)

export const identifyAlgorithm = (code: string, language: string) =>
  ollamaService.identifyAlgorithm(code, language)

export const autoAnalyze = (code: string, language: string) =>
  ollamaService.autoAnalyze(code, language)

// Re-export types for external use
export type { AnalysisType, CodeContext } from './promptOptimizer'
