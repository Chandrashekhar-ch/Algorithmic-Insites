/**
 * Prompt Optimization Service for Ollama AI
 * Generates optimized, specific prompts for faster and more focused responses
 */

export type AnalysisType = 
  | 'quick-complexity'
  | 'detailed-analysis' 
  | 'optimization-suggestions'
  | 'bug-detection'
  | 'educational-explanation'
  | 'step-by-step'
  | 'algorithm-identification'
  | 'performance-review'

export interface CodeContext {
  code: string
  language: string
  algorithmType?: string
  dataSize?: number
  userLevel?: 'beginner' | 'intermediate' | 'advanced'
  focusArea?: string[]
}

export interface OptimizedPrompt {
  systemPrompt: string
  userPrompt: string
  options: {
    temperature: number
    max_tokens: number
    top_p: number
    top_k: number
  }
}

/**
 * Prompt Optimizer Class
 */
export class PromptOptimizer {
  
  /**
   * Generate optimized prompt based on analysis type and context
   */
  static generateOptimizedPrompt(analysisType: AnalysisType, context: CodeContext): OptimizedPrompt {
    switch (analysisType) {
      case 'quick-complexity':
        return this.generateComplexityPrompt(context)
      
      case 'detailed-analysis':
        return this.generateDetailedAnalysisPrompt(context)
      
      case 'optimization-suggestions':
        return this.generateOptimizationPrompt(context)
      
      case 'bug-detection':
        return this.generateBugDetectionPrompt(context)
      
      case 'educational-explanation':
        return this.generateEducationalPrompt(context)
      
      case 'step-by-step':
        return this.generateStepByStepPrompt(context)
      
      case 'algorithm-identification':
        return this.generateAlgorithmIdentificationPrompt(context)
      
      case 'performance-review':
        return this.generatePerformanceReviewPrompt(context)
      
      default:
        return this.generateDefaultPrompt(context)
    }
  }

  /**
   * Quick Complexity Analysis - Fast O(n) analysis
   */
  private static generateComplexityPrompt(context: CodeContext): OptimizedPrompt {
    return {
      systemPrompt: `You are a Big O complexity analyzer. Provide ONLY time and space complexity analysis in this exact format:
TIME: O(?)
SPACE: O(?)
EXPLANATION: [1-2 sentences max]

Be precise and concise. No additional commentary.`,
      
      userPrompt: `Analyze time and space complexity of this ${context.language} code:
\`\`\`${context.language}
${context.code}
\`\`\``,
      
      options: {
        temperature: 0.1,  // Very focused
        max_tokens: 150,   // Short response
        top_p: 0.9,
        top_k: 20
      }
    }
  }

  /**
   * Detailed Analysis - Comprehensive code review
   */
  private static generateDetailedAnalysisPrompt(context: CodeContext): OptimizedPrompt {
    const userLevel = context.userLevel || 'intermediate'
    const focusAreas = context.focusArea || ['complexity', 'optimization', 'quality']
    
    return {
      systemPrompt: `You are an expert code reviewer for algorithm visualization platform. Provide structured analysis in this format:
🔍 ALGORITHM: [Name/Type]
📊 COMPLEXITY: Time O(?) | Space O(?)
⚡ OPTIMIZATION: [Key suggestions]
🎯 QUALITY: [Code quality assessment]
💡 INSIGHTS: [Key learning points for ${userLevel} developers]

Focus on: ${focusAreas.join(', ')}. Keep each section to 2-3 lines maximum.`,
      
      userPrompt: `Analyze this ${context.language} algorithm for educational platform (${userLevel} level):
${context.algorithmType ? `Expected algorithm: ${context.algorithmType}` : ''}
${context.dataSize ? `Typical data size: ${context.dataSize} elements` : ''}

\`\`\`${context.language}
${context.code}
\`\`\``,
      
      options: {
        temperature: 0.3,
        max_tokens: 400,
        top_p: 0.9,
        top_k: 40
      }
    }
  }

  /**
   * Optimization Suggestions - Performance improvements
   */
  private static generateOptimizationPrompt(context: CodeContext): OptimizedPrompt {
    return {
      systemPrompt: `You are a performance optimization expert. Provide ONLY optimization suggestions in this format:
🚀 CURRENT: O(?) complexity
⚡ OPTIMIZED: O(?) complexity possible
🔧 CHANGES:
• [Specific change 1]
• [Specific change 2]
• [Specific change 3]

Focus on practical, implementable improvements. No explanation of current code.`,
      
      userPrompt: `Suggest optimizations for this ${context.language} code:
\`\`\`${context.language}
${context.code}
\`\`\``,
      
      options: {
        temperature: 0.2,
        max_tokens: 250,
        top_p: 0.8,
        top_k: 30
      }
    }
  }

  /**
   * Bug Detection - Find potential issues
   */
  private static generateBugDetectionPrompt(context: CodeContext): OptimizedPrompt {
    return {
      systemPrompt: `You are a bug detection specialist. Scan for issues and respond in this format:
🐛 BUGS FOUND: [Number]
❌ CRITICAL: [Syntax/logic errors]
⚠️ WARNINGS: [Potential issues]
🔍 EDGE CASES: [Missing validations]
✅ STATUS: [SAFE/NEEDS_REVIEW/HAS_BUGS]

If no bugs found, state "STATUS: ✅ SAFE". Be specific about line numbers when possible.`,
      
      userPrompt: `Scan this ${context.language} code for bugs and potential issues:
\`\`\`${context.language}
${context.code}
\`\`\``,
      
      options: {
        temperature: 0.1,
        max_tokens: 300,
        top_p: 0.85,
        top_k: 25
      }
    }
  }

  /**
   * Educational Explanation - Learning-focused analysis
   */
  private static generateEducationalPrompt(context: CodeContext): OptimizedPrompt {
    const userLevel = context.userLevel || 'beginner'
    
    return {
      systemPrompt: `You are a computer science teacher explaining algorithms to ${userLevel} students. Use this format:
📚 WHAT IT DOES: [Simple explanation]
🔄 HOW IT WORKS: [Step-by-step logic]
🎯 KEY CONCEPTS: [Important CS concepts]
💭 WHY THIS MATTERS: [Real-world relevance]
🏆 DIFFICULTY: [${userLevel} appropriate assessment]

Use simple language and concrete examples. Make it engaging and educational.`,
      
      userPrompt: `Explain this ${context.language} algorithm to ${userLevel} students:
\`\`\`${context.language}
${context.code}
\`\`\``,
      
      options: {
        temperature: 0.4,
        max_tokens: 350,
        top_p: 0.9,
        top_k: 50
      }
    }
  }

  /**
   * Step-by-Step Analysis - Execution breakdown
   */
  private static generateStepByStepPrompt(context: CodeContext): OptimizedPrompt {
    return {
      systemPrompt: `You are an execution tracer. Break down the algorithm into clear steps:
🔢 INPUT: [What data enters]
📋 STEPS:
1. [First operation]
2. [Second operation] 
3. [Continue...]
📤 OUTPUT: [What is returned]
🔄 PATTERN: [Repeating logic]

Focus on the logical flow, not implementation details. Maximum 8 steps.`,
      
      userPrompt: `Break down execution steps for this ${context.language} algorithm:
${context.dataSize ? `Example data size: ${context.dataSize} elements` : ''}
\`\`\`${context.language}
${context.code}
\`\`\``,
      
      options: {
        temperature: 0.2,
        max_tokens: 300,
        top_p: 0.8,
        top_k: 30
      }
    }
  }

  /**
   * Algorithm Identification - Recognize patterns
   */
  private static generateAlgorithmIdentificationPrompt(context: CodeContext): OptimizedPrompt {
    return {
      systemPrompt: `You are an algorithm pattern recognition expert. Identify the algorithm in this exact format:
🎯 ALGORITHM: [Exact name]
🏷️ TYPE: [Sorting/Searching/Graph/Tree/etc]
🔄 PATTERN: [Approach used]
📊 COMPLEXITY: O(?) time, O(?) space
🎲 VARIANT: [If it's a specific variant]
✅ CONFIDENCE: [High/Medium/Low]

Be precise and definitive. If uncertain, state confidence level.`,
      
      userPrompt: `Identify this ${context.language} algorithm:
\`\`\`${context.language}
${context.code}
\`\`\``,
      
      options: {
        temperature: 0.1,
        max_tokens: 200,
        top_p: 0.8,
        top_k: 20
      }
    }
  }

  /**
   * Performance Review - Efficiency assessment
   */
  private static generatePerformanceReviewPrompt(context: CodeContext): OptimizedPrompt {
    return {
      systemPrompt: `You are a performance analyst. Assess efficiency in this format:
⚡ CURRENT SPEED: [O(?) analysis]
💾 MEMORY USAGE: [O(?) space analysis]
📈 SCALABILITY: [How it handles large data]
🎯 EFFICIENCY RATING: [1-10 score]
🔧 TOP IMPROVEMENT: [Single best optimization]
📊 BENCHMARK: [Compared to optimal solution]

Be quantitative and specific about performance metrics.`,
      
      userPrompt: `Review performance of this ${context.language} code:
${context.dataSize ? `Target data size: ${context.dataSize} elements` : ''}
\`\`\`${context.language}
${context.code}
\`\`\``,
      
      options: {
        temperature: 0.2,
        max_tokens: 250,
        top_p: 0.8,
        top_k: 25
      }
    }
  }

  /**
   * Default prompt for general analysis
   */
  private static generateDefaultPrompt(context: CodeContext): OptimizedPrompt {
    return {
      systemPrompt: `You are a code analyst for algorithm visualization platform. Provide concise analysis:
🔍 ANALYSIS: [Brief description]
📊 COMPLEXITY: [Time and space]
💡 NOTES: [Key insights]

Keep response focused and under 150 words.`,
      
      userPrompt: `Analyze this ${context.language} code:
\`\`\`${context.language}
${context.code}
\`\`\``,
      
      options: {
        temperature: 0.3,
        max_tokens: 200,
        top_p: 0.9,
        top_k: 40
      }
    }
  }

  /**
   * Pre-process code to remove noise and focus on algorithm
   */
  static preprocessCode(code: string, language: string): string {
    // Remove comments and excessive whitespace
    let cleanCode = code
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*$/gm, '')          // Remove line comments
      .replace(/^\s*\n/gm, '')          // Remove empty lines
      .trim()

    // Language-specific optimizations
    if (language === 'javascript' || language === 'typescript') {
      // Remove console.log statements
      cleanCode = cleanCode.replace(/console\.log\([^)]*\);?\s*/g, '')
    }

    if (language === 'python') {
      // Remove print statements
      cleanCode = cleanCode.replace(/print\([^)]*\)\s*/g, '')
    }

    return cleanCode
  }

  /**
   * Detect algorithm context automatically
   */
  static detectAlgorithmContext(code: string, language: string): Partial<CodeContext> {
    const lowerCode = code.toLowerCase()
    const context: Partial<CodeContext> = {}

    // Detect algorithm type
    if (lowerCode.includes('sort') || lowerCode.includes('swap')) {
      context.algorithmType = 'sorting'
    } else if (lowerCode.includes('search') || lowerCode.includes('find')) {
      context.algorithmType = 'searching'
    } else if (lowerCode.includes('tree') || lowerCode.includes('node')) {
      context.algorithmType = 'tree'
    } else if (lowerCode.includes('graph') || lowerCode.includes('edge')) {
      context.algorithmType = 'graph'
    }

    // Estimate complexity by loop nesting
    const nestedLoops = (code.match(/for\s*\(/g) || []).length
    if (nestedLoops >= 2) {
      context.focusArea = ['complexity', 'optimization']
    }

    // Detect data size indicators
    const arrayMatches = code.match(/\[\s*(\d+(?:\s*,\s*\d+)*)\s*\]/)
    if (arrayMatches) {
      const numbers = arrayMatches[1].split(',')
      context.dataSize = numbers.length
    }

    return context
  }
}

/**
 * Convenience function for quick prompt generation
 */
export function createOptimizedPrompt(
  analysisType: AnalysisType,
  code: string,
  language: string,
  options?: Partial<CodeContext>
): OptimizedPrompt {
  const cleanCode = PromptOptimizer.preprocessCode(code, language)
  const autoContext = PromptOptimizer.detectAlgorithmContext(cleanCode, language)
  
  const context: CodeContext = {
    code: cleanCode,
    language,
    ...autoContext,
    ...options
  }

  return PromptOptimizer.generateOptimizedPrompt(analysisType, context)
}

/**
 * Get recommended analysis type based on code characteristics
 */
export function getRecommendedAnalysisType(code: string, language: string): AnalysisType[] {
  const lowerCode = code.toLowerCase()
  const recommendations: AnalysisType[] = []

  // Always include quick complexity
  recommendations.push('quick-complexity')

  // Check for potential issues
  if (lowerCode.includes('while') && !lowerCode.includes('break')) {
    recommendations.push('bug-detection')
  }

  // Check for nested loops
  const loops = (code.match(/for\s*\(|while\s*\(/g) || []).length
  if (loops >= 2) {
    recommendations.push('optimization-suggestions')
  }

  // If it's a simple algorithm, suggest educational
  if (code.length < 500 && loops <= 2) {
    recommendations.push('educational-explanation')
  }

  // If it's complex, suggest detailed analysis
  if (code.length > 500 || loops > 2) {
    recommendations.push('detailed-analysis')
  }

  return recommendations
}
