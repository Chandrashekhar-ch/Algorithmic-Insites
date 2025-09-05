// Safe code execution utility for algorithm visualization

export interface AlgorithmStep {
  type: 'compare' | 'swap' | 'highlight' | 'move' | 'insert' | 'complete'
  indices: number[]
  array: number[]
  description: string
  metadata?: {
    comparisons?: number
    swaps?: number
    timeComplexity?: string
    spaceComplexity?: string
  }
}

/**
 * Safely parse and execute user-provided algorithm code
 * @param code - JavaScript code string containing algorithm implementation
 * @param data - Input array to be processed by the algorithm
 * @returns Array of algorithm steps for visualization
 */
export async function parseAndExecuteCode(code: string, data: number[]): Promise<AlgorithmStep[]> {
  try {
    // Validate input
    if (!code || typeof code !== 'string') {
      throw new Error('Invalid code input')
    }
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid or empty data array')
    }

    // Create a safe execution context
    const safeContext = createSafeContext(data)
    
    // Sanitize the code
    const sanitizedCode = sanitizeCode(code)
    
    // Execute the code in the safe context
    const result = await executeInSafeContext(sanitizedCode, safeContext)
    
    // Validate the result
    const steps = validateSteps(result)
    
    return steps
  } catch (error) {
    console.error('Code execution error:', error)
    throw new Error(`Code execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Create a safe execution context with limited global access
 */
function createSafeContext(data: number[]) {
  return {
    data: [...data], // Clone to prevent modification of original
    console: {
      log: (...args: any[]) => console.log('[User Code]:', ...args),
      error: (...args: any[]) => console.error('[User Code]:', ...args)
    },
    Math: Math,
    Array: Array,
    Object: Object,
    JSON: JSON,
    // Blocked globals for security
    window: undefined,
    document: undefined,
    fetch: undefined,
    XMLHttpRequest: undefined,
    WebSocket: undefined,
    localStorage: undefined,
    sessionStorage: undefined,
    eval: undefined,
    Function: undefined
  }
}

/**
 * Sanitize user code to prevent dangerous operations
 */
function sanitizeCode(code: string): string {
  // Remove dangerous patterns
  const dangerousPatterns = [
    /eval\s*\(/gi,
    /Function\s*\(/gi,
    /setTimeout\s*\(/gi,
    /setInterval\s*\(/gi,
    /document\./gi,
    /window\./gi,
    /global\./gi,
    /process\./gi,
    /require\s*\(/gi,
    /import\s+/gi,
    /fetch\s*\(/gi,
    /XMLHttpRequest/gi,
    /WebSocket/gi,
    /localStorage/gi,
    /sessionStorage/gi
  ]

  let sanitized = code
  dangerousPatterns.forEach(pattern => {
    if (pattern.test(sanitized)) {
      throw new Error(`Dangerous operation detected: ${pattern.source}`)
    }
  })

  // Ensure code returns something
  if (!sanitized.includes('return ')) {
    throw new Error('Code must return an array of steps')
  }

  return sanitized
}

/**
 * Execute code in a controlled environment
 */
async function executeInSafeContext(code: string, context: any): Promise<any> {
  try {
    // Create function with limited scope
    const funcBody = `
      "use strict";
      ${code}
    `
    
    // Get context keys and values
    const contextKeys = Object.keys(context)
    const contextValues = Object.values(context)
    
    // Create and execute function
    const func = new Function(...contextKeys, funcBody)
    const result = func(...contextValues)
    
    // Handle async results
    if (result instanceof Promise) {
      return await result
    }
    
    return result
  } catch (error) {
    throw new Error(`Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Validate that the execution result contains valid algorithm steps
 */
function validateSteps(result: any): AlgorithmStep[] {
  if (!Array.isArray(result)) {
    throw new Error('Algorithm must return an array of steps')
  }

  if (result.length === 0) {
    throw new Error('Algorithm must return at least one step')
  }

  const validatedSteps: AlgorithmStep[] = []

  for (let i = 0; i < result.length; i++) {
    const step = result[i]
    
    if (!step || typeof step !== 'object') {
      throw new Error(`Invalid step at index ${i}: must be an object`)
    }

    const validTypes = ['compare', 'swap', 'highlight', 'move', 'insert', 'complete']
    if (!validTypes.includes(step.type)) {
      throw new Error(`Invalid step type at index ${i}: ${step.type}. Valid types: ${validTypes.join(', ')}`)
    }

    if (!Array.isArray(step.indices)) {
      throw new Error(`Invalid indices at step ${i}: must be an array`)
    }

    if (!Array.isArray(step.array)) {
      throw new Error(`Invalid array at step ${i}: must be an array`)
    }

    if (typeof step.description !== 'string') {
      throw new Error(`Invalid description at step ${i}: must be a string`)
    }

    // Validate indices are within bounds
    const maxIndex = step.array.length - 1
    for (const index of step.indices) {
      if (typeof index !== 'number' || index < 0 || index > maxIndex) {
        throw new Error(`Invalid index ${index} at step ${i}: must be between 0 and ${maxIndex}`)
      }
    }

    validatedSteps.push({
      type: step.type,
      indices: step.indices,
      array: [...step.array], // Clone array
      description: step.description,
      metadata: step.metadata || {}
    })
  }

  return validatedSteps
}

/**
 * Generate example algorithm code templates
 */
export function getAlgorithmTemplates() {
  return {
    bubbleSort: `// Bubble Sort Algorithm
function bubbleSort(arr) {
  const steps = [];
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        array: [...arr],
        description: \`Comparing \${arr[j]} and \${arr[j + 1]}\`
      });
      
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          array: [...arr],
          description: \`Swapped \${arr[j]} and \${arr[j + 1]}\`
        });
      }
    }
  }
  
  steps.push({
    type: 'complete',
    indices: [],
    array: [...arr],
    description: 'Bubble sort completed!'
  });
  
  return steps;
}

return bubbleSort(data);`,

    insertionSort: `// Insertion Sort Algorithm
function insertionSort(arr) {
  const steps = [];
  
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    
    steps.push({
      type: 'highlight',
      indices: [i],
      array: [...arr],
      description: \`Selecting element \${key} to insert\`
    });
    
    while (j >= 0 && arr[j] > key) {
      steps.push({
        type: 'compare',
        indices: [j, i],
        array: [...arr],
        description: \`Comparing \${arr[j]} with \${key}\`
      });
      
      arr[j + 1] = arr[j];
      steps.push({
        type: 'move',
        indices: [j, j + 1],
        array: [...arr],
        description: \`Moving \${arr[j + 1]} one position right\`
      });
      
      j--;
    }
    
    arr[j + 1] = key;
    steps.push({
      type: 'insert',
      indices: [j + 1],
      array: [...arr],
      description: \`Inserted \${key} at position \${j + 1}\`
    });
  }
  
  steps.push({
    type: 'complete',
    indices: [],
    array: [...arr],
    description: 'Insertion sort completed!'
  });
  
  return steps;
}

return insertionSort(data);`,

    selectionSort: `// Selection Sort Algorithm
function selectionSort(arr) {
  const steps = [];
  
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    
    steps.push({
      type: 'highlight',
      indices: [i],
      array: [...arr],
      description: \`Starting pass \${i + 1}, current minimum: \${arr[minIndex]}\`
    });
    
    for (let j = i + 1; j < arr.length; j++) {
      steps.push({
        type: 'compare',
        indices: [minIndex, j],
        array: [...arr],
        description: \`Comparing \${arr[minIndex]} with \${arr[j]}\`
      });
      
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
        steps.push({
          type: 'highlight',
          indices: [minIndex],
          array: [...arr],
          description: \`New minimum found: \${arr[minIndex]}\`
        });
      }
    }
    
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      steps.push({
        type: 'swap',
        indices: [i, minIndex],
        array: [...arr],
        description: \`Swapped \${arr[i]} with \${arr[minIndex]}\`
      });
    }
  }
  
  steps.push({
    type: 'complete',
    indices: [],
    array: [...arr],
    description: 'Selection sort completed!'
  });
  
  return steps;
}

return selectionSort(data);`
  }
}

/**
 * Analyze algorithm complexity from steps
 */
export function analyzeComplexity(steps: AlgorithmStep[]): {
  timeComplexity: string
  spaceComplexity: string
  comparisons: number
  swaps: number
} {
  let comparisons = 0
  let swaps = 0
  
  steps.forEach(step => {
    if (step.type === 'compare') comparisons++
    if (step.type === 'swap') swaps++
  })
  
  // Simple heuristic for complexity analysis
  const n = steps.length > 0 && steps[0] ? steps[0].array.length : 0
  let timeComplexity = 'O(n²)' // Default for comparison sorts
  
  if (comparisons <= n) {
    timeComplexity = 'O(n)'
  } else if (comparisons <= n * Math.log(n)) {
    timeComplexity = 'O(n log n)'
  }
  
  return {
    timeComplexity,
    spaceComplexity: 'O(1)', // Most comparison sorts are in-place
    comparisons,
    swaps
  }
}
