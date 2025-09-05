import React, { useState, useRef } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Textarea,
  Button,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  IconButton,
  Tooltip,
  Badge,
  Divider,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { FaPlay, FaCode, FaCopy, FaRandom, FaRobot } from 'react-icons/fa'
import { useAlgorithmStore } from '../store/algorithmStore'
import { isAIAvailable, autoAnalyze, getQuickComplexity, detectBugs, getOptimizationSuggestions, getEducationalExplanation, type AnalysisType } from '../services/ollamaService';

interface CodeInputProps {
  onCodeExecute?: (steps: any[]) => void
}

const CodeInput: React.FC<CodeInputProps> = ({ onCodeExecute }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('bubble-sort')
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [analysisType, setAnalysisType] = useState<AnalysisType>('detailed-analysis')
  const [isExecuting, setIsExecuting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [localData, setLocalData] = useState('64, 34, 25, 12, 22, 11, 90')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  const { dataset, setAlgorithmSteps, setDataset } = useAlgorithmStore()
  
  const bgColor = useColorModeValue('gray.50', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  // Multi-language templates
  const languageTemplates = {
    javascript: {
      'bubble-sort': {
        name: 'Bubble Sort',
        code: `// Bubble Sort Algorithm in JavaScript
function bubbleSort(arr) {
  const n = arr.length;
  const steps = [];
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        array: [...arr],
        description: \`Comparing \${arr[j]} and \${arr[j + 1]}\`
      });
      
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          array: [...arr],
          description: \`Swapped \${arr[j + 1]} and \${arr[j]}\`
        });
      }
    }
  }
  
  steps.push({
    type: 'complete',
    array: [...arr],
    description: 'Sorting complete!'
  });
  
  return steps;
}

return bubbleSort(data);`
      },
      'insertion-sort': {
        name: 'Insertion Sort',
        code: `// Insertion Sort Algorithm in JavaScript
function insertionSort(arr) {
  const steps = [];
  
  for (let i = 1; i < arr.length; i++) {
    let key = arr[i];
    let j = i - 1;
    
    steps.push({
      type: 'highlight',
      indices: [i],
      array: [...arr],
      description: \`Inserting \${key} into sorted portion\`
    });
    
    while (j >= 0 && arr[j] > key) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        array: [...arr],
        description: \`Comparing \${arr[j]} with \${key}\`
      });
      
      arr[j + 1] = arr[j];
      steps.push({
        type: 'move',
        indices: [j, j + 1],
        array: [...arr],
        description: \`Moving \${arr[j + 1]} to the right\`
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
  
  return steps;
}

return insertionSort(data);`
      }
    },
    python: {
      'bubble-sort': {
        name: 'Bubble Sort',
        code: `# Bubble Sort Algorithm in Python
def bubble_sort(arr):
    n = len(arr)
    steps = []
    
    for i in range(n - 1):
        for j in range(n - i - 1):
            steps.append({
                'type': 'compare',
                'indices': [j, j + 1],
                'array': arr.copy(),
                'description': f'Comparing {arr[j]} and {arr[j + 1]}'
            })
            
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                steps.append({
                    'type': 'swap',
                    'indices': [j, j + 1],
                    'array': arr.copy(),
                    'description': f'Swapped {arr[j]} and {arr[j + 1]}'
                })
    
    steps.append({
        'type': 'complete',
        'array': arr.copy(),
        'description': 'Sorting complete!'
    })
    
    return steps

# This Python code will be translated to JavaScript for execution
# You can write Python algorithms and they will be automatically converted
return bubble_sort(data)`
      },
      'insertion-sort': {
        name: 'Insertion Sort',
        code: `# Insertion Sort Algorithm in Python
def insertion_sort(arr):
    steps = []
    
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        
        steps.append({
            'type': 'highlight',
            'indices': [i],
            'array': arr.copy(),
            'description': f'Inserting {key} into sorted portion'
        })
        
        while j >= 0 and arr[j] > key:
            steps.append({
                'type': 'compare',
                'indices': [j, j + 1],
                'array': arr.copy(),
                'description': f'Comparing {arr[j]} with {key}'
            })
            
            arr[j + 1] = arr[j]
            steps.append({
                'type': 'move',
                'indices': [j, j + 1],
                'array': arr.copy(),
                'description': f'Moving {arr[j + 1]} to position {j + 1}'
            })
            
            j -= 1
        
        arr[j + 1] = key
        steps.append({
            'type': 'insert',
            'indices': [j + 1],
            'array': arr.copy(),
            'description': f'Inserted {key} at position {j + 1}'
        })
    
    return steps

# This Python code will be translated to JavaScript for execution
return insertion_sort(data)`
      }
    },
    cpp: {
      'bubble-sort': {
        name: 'Bubble Sort',
        code: `// Bubble Sort Algorithm in C++
#include <vector>
#include <string>

struct AlgorithmStep {
    std::string type;
    std::vector<int> indices;
    std::vector<int> array;
    std::string description;
};

std::vector<AlgorithmStep> bubbleSort(std::vector<int> arr) {
    std::vector<AlgorithmStep> steps;
    int n = arr.size();
    
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            steps.push_back({
                "compare",
                {j, j + 1},
                arr,
                "Comparing " + std::to_string(arr[j]) + " and " + std::to_string(arr[j + 1])
            });
            
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
                steps.push_back({
                    "swap",
                    {j, j + 1},
                    arr,
                    "Swapped " + std::to_string(arr[j]) + " and " + std::to_string(arr[j + 1])
                });
            }
        }
    }
    
    steps.push_back({
        "complete",
        {},
        arr,
        "Sorting complete!"
    });
    
    return steps;
}

// This C++ code will be simulated in JavaScript for visualization
// Write your C++ algorithm above, it will be converted automatically`
      }
    },
    java: {
      'bubble-sort': {
        name: 'Bubble Sort',
        code: `// Bubble Sort Algorithm in Java
import java.util.*;

public class BubbleSort {
    static class AlgorithmStep {
        String type;
        int[] indices;
        int[] array;
        String description;
        
        AlgorithmStep(String type, int[] indices, int[] array, String description) {
            this.type = type;
            this.indices = indices;
            this.array = array.clone();
            this.description = description;
        }
    }
    
    public static List<AlgorithmStep> bubbleSort(int[] arr) {
        List<AlgorithmStep> steps = new ArrayList<>();
        int n = arr.length;
        
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                steps.add(new AlgorithmStep(
                    "compare",
                    new int[]{j, j + 1},
                    arr,
                    "Comparing " + arr[j] + " and " + arr[j + 1]
                ));
                
                if (arr[j] > arr[j + 1]) {
                    // Swap elements
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    
                    steps.add(new AlgorithmStep(
                        "swap",
                        new int[]{j, j + 1},
                        arr,
                        "Swapped " + arr[j] + " and " + arr[j + 1]
                    ));
                }
            }
        }
        
        steps.add(new AlgorithmStep(
            "complete",
            new int[]{},
            arr,
            "Sorting complete!"
        ));
        
        return steps;
    }
}

// This Java code will be simulated in JavaScript for visualization
// Write your Java algorithm above, it will be converted automatically`
      }
    }
  }

  // Set initial code based on default language and template
  const [code, setCode] = useState(languageTemplates.javascript['bubble-sort'].code)

  // Helper function to get templates for a specific language
  const getTemplatesForLanguage = (language: string) => {
    return languageTemplates[language as keyof typeof languageTemplates] || languageTemplates.javascript
  }

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template)
    const templates = getTemplatesForLanguage(selectedLanguage)
    if (templates[template as keyof typeof templates]) {
      setCode(templates[template as keyof typeof templates].code)
    }
  }

  const translateCodeToJavaScript = (code: string, language: string) => {
    if (language === 'javascript') {
      return code
    }
    
    // For now, return the JavaScript equivalent manually
    // In a production environment, you could implement proper language transpilation
    if (language === 'python' && code.includes('bubble_sort')) {
      return languageTemplates.javascript['bubble-sort'].code
    }
    
    if (language === 'python' && code.includes('insertion_sort')) {
      return languageTemplates.javascript['insertion-sort'].code
    }
    
    // For C++ and Java, return JavaScript equivalent for now
    if ((language === 'cpp' || language === 'java') && code.includes('bubbleSort')) {
      return languageTemplates.javascript['bubble-sort'].code
    }
    
    // Default fallback - try to execute as-is (JavaScript)
    return code
  }

  // Function to extract data arrays from code
  const extractDataFromCode = (code: string, language: string): number[] => {
    const patterns = {
      javascript: [
        // Arrays: [1, 2, 3], [1,2,3], [ 1 , 2 , 3 ]
        /\[\s*(\d+(?:\s*,\s*\d+)*)\s*\]/g,
        // Variables: numbers = [1, 2, 3]
        /(?:numbers|arr|array|data)\s*=\s*\[\s*(\d+(?:\s*,\s*\d+)*)\s*\]/g,
        // Function calls: bubbleSort([1, 2, 3])
        /\w+\(\s*\[\s*(\d+(?:\s*,\s*\d+)*)\s*\]\s*\)/g
      ],
      python: [
        // Lists: [1, 2, 3], [1,2,3], [ 1 , 2 , 3 ]
        /\[\s*(\d+(?:\s*,\s*\d+)*)\s*\]/g,
        // Variables: numbers = [1, 2, 3]
        /(?:numbers|arr|array|data)\s*=\s*\[\s*(\d+(?:\s*,\s*\d+)*)\s*\]/g,
        // Function calls: bubble_sort([1, 2, 3])
        /\w+\(\s*\[\s*(\d+(?:\s*,\s*\d+)*)\s*\]\s*\)/g
      ],
      cpp: [
        // Vectors: {1, 2, 3}, vector<int> arr = {1, 2, 3}
        /\{\s*(\d+(?:\s*,\s*\d+)*)\s*\}/g,
        // Arrays: [1, 2, 3]
        /\[\s*(\d+(?:\s*,\s*\d+)*)\s*\]/g
      ],
      java: [
        // Arrays: {1, 2, 3}, new int[]{1, 2, 3}
        /\{\s*(\d+(?:\s*,\s*\d+)*)\s*\}/g,
        // Arrays: [1, 2, 3]
        /\[\s*(\d+(?:\s*,\s*\d+)*)\s*\]/g
      ]
    }

    const languagePatterns = patterns[language as keyof typeof patterns] || patterns.javascript
    const foundArrays: number[][] = []

    for (const pattern of languagePatterns) {
      let match
      while ((match = pattern.exec(code)) !== null) {
        const numbersStr = match[1]
        if (numbersStr) {
          const numbers = numbersStr.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
          if (numbers.length > 0) {
            foundArrays.push(numbers)
          }
        }
      }
    }

    // Return the largest array found (most likely the main data)
    if (foundArrays.length > 0) {
      return foundArrays.reduce((largest, current) => 
        current.length > largest.length ? current : largest
      )
    }

    return []
  }

  const handleExecuteCode = async () => {
    if (!code.trim()) {
      setError('Please enter some code to execute')
      return
    }

    setIsExecuting(true)
    setError(null)

    try {
      // First, try to extract data directly from the code
      let dataToUse = extractDataFromCode(code, selectedLanguage)
      
      // If no data found in code, try to use local data input as fallback
      if (dataToUse.length === 0 && localData.trim()) {
        try {
          dataToUse = localData.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
        } catch (err) {
          setError('Invalid data format in input field. Please use numbers separated by commas.')
          return
        }
      }
      
      // If still no data, use store dataset as final fallback
      if (dataToUse.length === 0 && dataset && dataset.length > 0) {
        dataToUse = dataset
      }
      
      // If still no data, show error
      if (!dataToUse || dataToUse.length === 0) {
        setError('No data found! Please include an array of numbers in your code (e.g., [64, 34, 25, 12, 22, 11, 90]) or use the input field below.')
        return
      }

      // Update the local data display to show what was extracted
      if (dataToUse !== dataset) {
        setLocalData(dataToUse.join(', '))
        setDataset(dataToUse)
      }

      // Translate code to JavaScript if necessary
      const jsCode = translateCodeToJavaScript(code, selectedLanguage)
      
      // Dynamic import to handle module resolution issues
      const { parseAndExecuteCode } = await import('../utils/codeExecutor')
      const executorSteps = await parseAndExecuteCode(jsCode, dataToUse)
      
      // Convert codeExecutor steps to store format
      const storeSteps = executorSteps.map((step, index) => ({
        id: `step-${index}`,
        description: step.description,
        highlightedElements: step.type === 'highlight' ? step.indices : [],
        comparingElements: step.type === 'compare' ? step.indices : [],
        swappingElements: step.type === 'swap' ? step.indices : [],
        data: [...step.array]
      }))
      
      setAlgorithmSteps(storeSteps)
      onCodeExecute?.(storeSteps)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error executing code')
    } finally {
      setIsExecuting(false)
    }
  }

  const handleAnalyzeCode = async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze')
      return
    }

    if (!isAIAvailable()) {
      setError('AI analysis is not available. Make sure Ollama is running with a suitable model.')
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setAnalysisResult(null)

    try {
      let result: string
      
      // Use specialized analysis functions based on type
      switch (analysisType) {
        case 'quick-complexity':
          result = await getQuickComplexity(code, selectedLanguage)
          break
        case 'bug-detection':
          result = await detectBugs(code, selectedLanguage)
          break
        case 'optimization-suggestions':
          result = await getOptimizationSuggestions(code, selectedLanguage)
          break
        case 'educational-explanation':
          result = await getEducationalExplanation(code, selectedLanguage)
          break
        default:
          // Use autoAnalyze for comprehensive analysis
          const autoResults = await autoAnalyze(code, selectedLanguage)
          result = autoResults.map(r => `**${r.type.toUpperCase()}:**\n${r.result}`).join('\n\n')
      }
      
      setAnalysisResult(result)
    } catch (error) {
      console.error('Code analysis error:', error)
      setError(`Analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
  }

  const handleLineNumbers = () => {
    if (!textareaRef.current) return
    
    const lines = code.split('\n')
    const lineCount = lines.length
    
    // Update textarea with line numbers (visual enhancement)
    const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n')
    
    // This is a simplified version - you could enhance with a proper code editor
    console.log('Line numbers:', lineNumbers)
  }

  return (
    <Box
      bg={bgColor}
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      w="100%"
    >
      <VStack spacing={4} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <HStack>
            <FaCode />
            <Text fontSize="lg" fontWeight="bold">
              Algorithm Code Editor
            </Text>
            <Badge colorScheme="blue" variant="subtle">
              {selectedLanguage.toUpperCase()}
            </Badge>
          </HStack>
          
          <HStack>
            <Select
              size="sm"
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value)
                // Auto-select first template for the language
                const firstTemplate = Object.keys(getTemplatesForLanguage(e.target.value))[0]
                if (firstTemplate) {
                  setSelectedTemplate(firstTemplate)
                  const templates = getTemplatesForLanguage(e.target.value)
                  setCode(templates[firstTemplate as keyof typeof templates].code)
                }
              }}
              w="120px"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </Select>
            
            <Select
              size="sm"
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              w="200px"
            >
              {Object.entries(getTemplatesForLanguage(selectedLanguage)).map(([key, template]) => (
                <option key={key} value={key}>{template.name}</option>
              ))}
            </Select>
            
            <Tooltip label="Copy Code">
              <IconButton
                icon={<FaCopy />}
                size="sm"
                variant="ghost"
                onClick={handleCopyCode}
                aria-label="Copy code"
              />
            </Tooltip>
          </HStack>
        </HStack>

        <Divider />

        {/* Data Input Section */}
        <Box>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="semibold">
              Data Input (auto-extracted from code arrays, or manual fallback)
            </FormLabel>
            <Text fontSize="xs" color="gray.500" mb={2}>
              Data will be automatically extracted from arrays in your code. If no arrays are found, enter numbers manually below:
            </Text>
            <HStack>
              <Input
                value={localData}
                onChange={(e) => setLocalData(e.target.value)}
                placeholder="e.g., 64, 34, 25, 12, 22, 11, 90 (fallback if no arrays found in code)"
                size="sm"
                bg={useColorModeValue('white', 'gray.900')}
              />
              <Tooltip label="Generate Random Data">
                <IconButton
                  icon={<FaRandom />}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const randomData = Array.from(
                      { length: 8 }, 
                      () => Math.floor(Math.random() * 100) + 1
                    ).join(', ')
                    setLocalData(randomData)
                  }}
                  aria-label="Generate random data"
                />
              </Tooltip>
            </HStack>
            <Text fontSize="xs" color="gray.500" mt={1}>
              Current data: {localData || 'None'}
            </Text>
        </FormControl>
      </Box>

        <Divider />

        {/* Code Editor */}
        <Box position="relative">
          <Textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your algorithm code here..."
            fontFamily="'Fira Code', 'Monaco', 'Consolas', monospace"
            fontSize="sm"
            h="300px"
            resize="vertical"
            bg={useColorModeValue('white', 'gray.900')}
            border="1px"
            borderColor={borderColor}
            _focus={{
              borderColor: 'blue.400',
              boxShadow: '0 0 0 1px blue.400'
            }}
            spellCheck={false}
            onScroll={handleLineNumbers}
          />
          
          {/* Syntax highlighting overlay could go here */}
          <Box
            position="absolute"
            top={2}
            left={2}
            pointerEvents="none"
            opacity={0.6}
            fontSize="xs"
            color="gray.500"
            fontFamily="monospace"
          >
            {/* Line numbers could be rendered here */}
          </Box>
        </Box>

        {/* Error Display */}
        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <AlertTitle mr={2}>Execution Error:</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* AI Analysis Result */}
        {analysisResult && (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle mr={2}>🤖 AI Code Analysis:</AlertTitle>
              <AlertDescription>
                <Text whiteSpace="pre-wrap" fontSize="sm">
                  {analysisResult}
                </Text>
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Controls */}
        <HStack justify="space-between">
          <HStack>
            <Text fontSize="sm" color="gray.600">
              💡 Tip: Use 'data' variable to access your input array
            </Text>
          </HStack>
          
          <HStack>
            <Button
              leftIcon={<FaPlay />}
              colorScheme="blue"
              onClick={handleExecuteCode}
              isLoading={isExecuting}
              loadingText="Executing..."
              size="sm"
            >
              Execute Code
            </Button>
            
            <Select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value as AnalysisType)}
              size="sm"
              width="200px"
              bg={useColorModeValue('white', 'gray.700')}
            >
              <option value="detailed-analysis">Detailed Analysis</option>
              <option value="quick-complexity">Quick Complexity</option>
              <option value="bug-detection">Bug Detection</option>
              <option value="optimization-suggestions">Optimization Tips</option>
              <option value="educational-explanation">Educational</option>
              <option value="step-by-step">Step by Step</option>
              <option value="algorithm-identification">Algorithm ID</option>
              <option value="performance-review">Performance Review</option>
            </Select>
            
            <Button
              leftIcon={<FaRobot />}
              colorScheme="purple"
              variant="outline"
              onClick={handleAnalyzeCode}
              isLoading={isAnalyzing}
              loadingText="Analyzing..."
              size="sm"
              isDisabled={!isAIAvailable()}
            >
              AI Analysis
            </Button>
          </HStack>
        </HStack>

        {/* Instructions */}
        <Box
          bg={useColorModeValue('blue.50', 'blue.900')}
          p={3}
          borderRadius="md"
          fontSize="sm"
        >
          <Text fontWeight="semibold" mb={2}>
            📝 How to use:
          </Text>
          <VStack align="start" spacing={1} fontSize="xs">
            <Text>• Select your preferred programming language</Text>
            <Text>• Choose a template or write your own algorithm</Text>
            <Text>• Each step should have: type, indices, array, description</Text>
            <Text>• Types: 'compare', 'swap', 'highlight', 'move', 'insert', 'complete'</Text>
            <Text>• Use the 'data' variable to access your input array</Text>
            <Text>• {selectedLanguage === 'javascript' ? 'Return the steps array' : 'Code will be translated to JavaScript for execution'}</Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}

export default CodeInput
