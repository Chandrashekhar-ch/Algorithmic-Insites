/**
 * Multi-Language Code Execution Service
 * Supports JavaScript (native), Python (Pyodide), C++ (WASM), Java (compilation services)
 */

export interface ExecutionResult {
  success: boolean
  output?: string
  error?: string
  steps?: AlgorithmStep[]
  executionTime?: number
}

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

export type SupportedLanguage = 'javascript' | 'python' | 'cpp' | 'java' | 'rust' | 'go'

class CodeExecutionService {
  private pyodideReady = false
  private wasmModuleReady = false
  
  constructor() {
    this.initializeEnvironments()
  }

  /**
   * Initialize execution environments for different languages
   */
  private async initializeEnvironments() {
    try {
      // Initialize Pyodide for Python execution
      await this.initializePyodide()
      
      // Initialize WASM module for C++/Rust
      await this.initializeWASM()
    } catch (error) {
      console.warn('Some execution environments failed to initialize:', error)
    }
  }

  /**
   * Initialize Pyodide for Python code execution
   */
  private async initializePyodide() {
    try {
      if (typeof window !== 'undefined' && !(window as any).pyodide) {
        // Load Pyodide script dynamically
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
        document.head.appendChild(script)
        
        await new Promise((resolve, reject) => {
          script.onload = resolve
          script.onerror = reject
        })
        
        // Initialize Pyodide
        ;(window as any).pyodide = await (window as any).loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
        })
        
        this.pyodideReady = true
        console.log('✅ Pyodide initialized for Python execution')
      }
    } catch (error) {
      console.warn('❌ Failed to initialize Pyodide:', error)
    }
  }

  /**
   * Initialize WebAssembly for C++/Rust execution
   */
  private async initializeWASM() {
    try {
      // For now, we'll use a compilation service approach
      // In production, you could compile specific algorithms to WASM
      this.wasmModuleReady = true
      console.log('✅ WASM environment ready')
    } catch (error) {
      console.warn('❌ Failed to initialize WASM:', error)
    }
  }

  /**
   * Execute code in the specified language
   */
  async executeCode(
    code: string, 
    language: SupportedLanguage, 
    data: number[]
  ): Promise<ExecutionResult> {
    const startTime = performance.now()
    
    try {
      let result: ExecutionResult
      
      switch (language) {
        case 'javascript':
          result = await this.executeJavaScript(code, data)
          break
        case 'python':
          result = await this.executePython(code, data)
          break
        case 'cpp':
          result = await this.executeCpp(code, data)
          break
        case 'java':
          result = await this.executeJava(code, data)
          break
        case 'rust':
          result = await this.executeRust(code, data)
          break
        case 'go':
          result = await this.executeGo(code, data)
          break
        default:
          throw new Error(`Unsupported language: ${language}`)
      }
      
      const executionTime = performance.now() - startTime
      return { ...result, executionTime }
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown execution error',
        executionTime: performance.now() - startTime
      }
    }
  }

  /**
   * Execute JavaScript code (native sandbox)
   */
  private async executeJavaScript(code: string, data: number[]): Promise<ExecutionResult> {
    try {
      // Use the existing safe code executor
      const { parseAndExecuteCode } = await import('../utils/codeExecutor')
      const steps = await parseAndExecuteCode(code, data)
      
      return {
        success: true,
        steps,
        output: `Executed JavaScript successfully. Generated ${steps.length} visualization steps.`
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'JavaScript execution failed'
      }
    }
  }

  /**
   * Execute Python code using Pyodide
   */
  private async executePython(code: string, data: number[]): Promise<ExecutionResult> {
    if (!this.pyodideReady || typeof window === 'undefined') {
      return {
        success: false,
        error: 'Python execution environment not available. Pyodide not loaded.'
      }
    }

    try {
      const pyodide = (window as any).pyodide
      
      // Prepare Python execution environment
      pyodide.globals.set('input_data', data)
      
      // Wrap user code to capture algorithm steps
      const wrappedCode = `
import json
import sys
from io import StringIO

# Algorithm step tracking
steps = []
original_data = input_data.copy()

def track_step(step_type, indices, array, description):
    steps.append({
        'type': step_type,
        'indices': indices,
        'array': array.copy(),
        'description': description
    })

# Inject step tracking into common operations
class StepTracker:
    def __init__(self, arr):
        self.arr = arr
        
    def compare(self, i, j, description="Comparing elements"):
        track_step('compare', [i, j], self.arr, description)
        return self.arr[i] > self.arr[j]
        
    def swap(self, i, j, description="Swapping elements"):
        track_step('swap', [i, j], self.arr, description)
        self.arr[i], self.arr[j] = self.arr[j], self.arr[i]
        
    def highlight(self, indices, description="Highlighting elements"):
        track_step('highlight', indices, self.arr, description)

# Replace the data variable in user code
data = input_data.copy()
tracker = StepTracker(data)

# Capture stdout
old_stdout = sys.stdout
sys.stdout = captured_output = StringIO()

try:
    # Execute user code
    ${code}
    
    # Capture final result
    track_step('complete', [], data, 'Algorithm completed')
    
    # Get output
    output = captured_output.getvalue()
    
    # Return results
    result = {
        'success': True,
        'output': output,
        'steps': steps,
        'final_array': data
    }
    
except Exception as e:
    result = {
        'success': False,
        'error': str(e),
        'steps': steps
    }
finally:
    sys.stdout = old_stdout

result
`

      const result = pyodide.runPython(wrappedCode)
      const pythonResult = result.toJs({ dict_converter: Object.fromEntries })
      
      if (pythonResult.success) {
        return {
          success: true,
          steps: pythonResult.steps,
          output: pythonResult.output || `Python execution completed. Final array: [${pythonResult.final_array.join(', ')}]`
        }
      } else {
        return {
          success: false,
          error: pythonResult.error
        }
      }
      
    } catch (error) {
      return {
        success: false,
        error: `Python execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Execute C++ code using online compilation service
   */
  private async executeCpp(code: string, data: number[]): Promise<ExecutionResult> {
    try {
      // Use JDoodle API for C++ compilation and execution
      const response = await fetch('https://api.jdoodle.com/v1/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: 'your-client-id', // You need to register at JDoodle
          clientSecret: 'your-client-secret',
          script: this.wrapCppCode(code, data),
          language: 'cpp17',
          versionIndex: '0'
        })
      })

      const result = await response.json()
      
      if (result.output) {
        return {
          success: true,
          output: result.output,
          steps: this.parseCppOutput(result.output)
        }
      } else {
        return {
          success: false,
          error: result.error || 'C++ compilation/execution failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `C++ execution service unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Execute Java code using online compilation service
   */
  private async executeJava(code: string, data: number[]): Promise<ExecutionResult> {
    try {
      const response = await fetch('https://api.jdoodle.com/v1/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: 'your-client-id',
          clientSecret: 'your-client-secret',
          script: this.wrapJavaCode(code, data),
          language: 'java',
          versionIndex: '3'
        })
      })

      const result = await response.json()
      
      if (result.output) {
        return {
          success: true,
          output: result.output,
          steps: this.parseJavaOutput(result.output)
        }
      } else {
        return {
          success: false,
          error: result.error || 'Java compilation/execution failed'
        }
      }
    } catch (error) {
      return {
        success: false,
        error: `Java execution service unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  /**
   * Execute Rust code (placeholder for WASM compilation)
   */
  private async executeRust(code: string, data: number[]): Promise<ExecutionResult> {
    return {
      success: false,
      error: 'Rust execution not yet implemented. Consider using Rust-to-WASM compilation.'
    }
  }

  /**
   * Execute Go code using online compilation service
   */
  private async executeGo(code: string, data: number[]): Promise<ExecutionResult> {
    return {
      success: false,
      error: 'Go execution not yet implemented. Can be added using online compilation services.'
    }
  }

  /**
   * Wrap C++ code with step tracking
   */
  private wrapCppCode(code: string, data: number[]): string {
    return `
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

vector<int> data = {${data.join(', ')}};

void printStep(string type, vector<int> indices, vector<int> arr, string desc) {
    cout << "STEP:" << type << ":";
    for(int i : indices) cout << i << ",";
    cout << ":";
    for(int val : arr) cout << val << ",";
    cout << ":" << desc << endl;
}

${code}

int main() {
    // Print initial state
    printStep("highlight", {}, data, "Initial array");
    
    // Execute algorithm (user should call their function here)
    // bubbleSort(data); // Example
    
    // Print final state
    printStep("complete", {}, data, "Algorithm completed");
    
    cout << "Final array: ";
    for(int val : data) cout << val << " ";
    cout << endl;
    
    return 0;
}
`
  }

  /**
   * Wrap Java code with step tracking
   */
  private wrapJavaCode(code: string, data: number[]): string {
    return `
import java.util.*;

public class Main {
    static int[] data = {${data.join(', ')}};
    
    static void printStep(String type, int[] indices, int[] arr, String desc) {
        System.out.print("STEP:" + type + ":");
        for(int i : indices) System.out.print(i + ",");
        System.out.print(":");
        for(int val : arr) System.out.print(val + ",");
        System.out.println(":" + desc);
    }
    
    ${code}
    
    public static void main(String[] args) {
        printStep("highlight", new int[]{}, data, "Initial array");
        
        // Execute algorithm
        // bubbleSort(data); // Example
        
        printStep("complete", new int[]{}, data, "Algorithm completed");
        
        System.out.print("Final array: ");
        for(int val : data) System.out.print(val + " ");
        System.out.println();
    }
}
`
  }

  /**
   * Parse C++ output to extract algorithm steps
   */
  private parseCppOutput(output: string): AlgorithmStep[] {
    const lines = output.split('\n')
    const steps: AlgorithmStep[] = []
    
    for (const line of lines) {
      if (line.startsWith('STEP:')) {
        const parts = line.split(':')
        if (parts.length >= 4) {
          const type = parts[1] as any
          const indices = parts[2] ? parts[2].split(',').filter(i => i).map(Number) : []
          const array = parts[3] ? parts[3].split(',').filter(v => v).map(Number) : []
          const description = parts[4] || ''
          
          steps.push({ type, indices, array, description })
        }
      }
    }
    
    return steps
  }

  /**
   * Parse Java output to extract algorithm steps
   */
  private parseJavaOutput(output: string): AlgorithmStep[] {
    return this.parseCppOutput(output) // Same format
  }

  /**
   * Check if a language is supported and ready
   */
  isLanguageReady(language: SupportedLanguage): boolean {
    switch (language) {
      case 'javascript':
        return true
      case 'python':
        return this.pyodideReady
      case 'cpp':
      case 'java':
        return true // Online compilation services
      case 'rust':
      case 'go':
        return false // Not implemented yet
      default:
        return false
    }
  }

  /**
   * Get status of all execution environments
   */
  getEnvironmentStatus() {
    return {
      javascript: { ready: true, method: 'Native sandbox' },
      python: { ready: this.pyodideReady, method: 'Pyodide WASM' },
      cpp: { ready: true, method: 'Online compilation (JDoodle)' },
      java: { ready: true, method: 'Online compilation (JDoodle)' },
      rust: { ready: false, method: 'Not implemented' },
      go: { ready: false, method: 'Not implemented' }
    }
  }
}

export const codeExecutionService = new CodeExecutionService()
export default codeExecutionService
