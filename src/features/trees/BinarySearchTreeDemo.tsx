import React, { useEffect } from 'react'
import { Box, VStack, HStack, Button, Input, Text, Flex } from '@chakra-ui/react'
import { BinarySearchTree, BSTVisualizationStep } from '../../algorithms/binarySearchTree'
import BinaryTreeVisualizer from './BinaryTreeVisualizer'
import { useStore } from '../../store/useStore'

interface BinarySearchTreeDemoProps {
  isComparison?: boolean
}

const BinarySearchTreeDemo: React.FC<BinarySearchTreeDemoProps> = ({
  isComparison = false
}) => {
  const {
    setDataset,
    setSteps,
    setCurrentStep,
    reset,
    play,
    pause,
    nextStep,
    previousStep,
    isPlaying,
    currentStep,
    steps,
    dataset
  } = useStore(state => isComparison ? state.comparison : state.main)

  const [bst] = React.useState(() => new BinarySearchTree())
  const [inputValue, setInputValue] = React.useState('')
  const [operation, setOperation] = React.useState<'search' | 'insert'>('insert')

  // Initialize with sample tree
  useEffect(() => {
    bst.buildSampleTree()
    setDataset(bst.toD3Format())
  }, [bst, setDataset])

  const handleOperation = () => {
    const value = parseInt(inputValue)
    if (isNaN(value)) return

    bst.clearHighlights()
    const generator = operation === 'search' ? bst.search(value) : bst.insert(value)
    const newSteps: BSTVisualizationStep[] = []

    let result = generator.next()
    while (!result.done) {
      newSteps.push(result.value)
      result = generator.next()
    }

    setSteps(newSteps)
    setCurrentStep(0)
    setDataset(bst.toD3Format())
    setInputValue('')
  }

  const handleReset = () => {
    bst.clearHighlights()
    reset()
    setDataset(bst.toD3Format())
  }

  const handleStepChange = (stepIndex: number) => {
    bst.clearHighlights()
    
    if (stepIndex >= 0 && stepIndex < steps.length) {
      const step = steps[stepIndex] as BSTVisualizationStep
      
      // Apply highlighting based on current step
      if (step.currentNode) {
        const findAndHighlight = (node: any, targetId: string): boolean => {
          if (!node) return false
          
          if (node.id === targetId) {
            if (step.type === 'compare') {
              node.isComparing = true
            } else if (step.type === 'found' || step.type === 'insert') {
              node.isHighlighted = true
            }
            return true
          }
          
          let found = false
          if (node.children) {
            for (const child of node.children) {
              if (findAndHighlight(child, targetId)) {
                found = true
                break
              }
            }
          }
          return found
        }

        const treeData = bst.toD3Format()
        if (treeData) {
          findAndHighlight(treeData, step.currentNode)
          setDataset(treeData)
        }
      }
    }
    
    setCurrentStep(stepIndex)
  }

  const currentStepData = steps[currentStep] as BSTVisualizationStep | undefined

  return (
    <VStack spacing={6} align="stretch">
      {/* Controls */}
      <Box bg="white" p={4} borderRadius="lg" shadow="md">
        <VStack spacing={4}>
          <Text fontSize="xl" fontWeight="bold">
            Binary Search Tree {isComparison ? '(Comparison)' : ''}
          </Text>
          
          <HStack spacing={4} wrap="wrap">
            <HStack>
              <Input
                placeholder="Enter number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                type="number"
                width="150px"
              />
              <Button
                colorScheme={operation === 'insert' ? 'blue' : 'gray'}
                onClick={() => setOperation('insert')}
                size="sm"
              >
                Insert
              </Button>
              <Button
                colorScheme={operation === 'search' ? 'blue' : 'gray'}
                onClick={() => setOperation('search')}
                size="sm"
              >
                Search
              </Button>
              <Button
                colorScheme="green"
                onClick={handleOperation}
                isDisabled={!inputValue.trim()}
              >
                Execute
              </Button>
            </HStack>
            
            <HStack>
              <Button onClick={isPlaying ? pause : play} colorScheme="blue">
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button onClick={previousStep} isDisabled={currentStep === 0}>
                Previous
              </Button>
              <Button onClick={nextStep} isDisabled={currentStep >= steps.length - 1}>
                Next
              </Button>
              <Button onClick={handleReset} colorScheme="red" variant="outline">
                Reset
              </Button>
            </HStack>
          </HStack>
        </VStack>
      </Box>

      {/* Visualization */}
      <BinaryTreeVisualizer
        treeData={dataset}
        isComparison={isComparison}
        width={900}
        height={600}
      />

      {/* Step Information */}
      {currentStepData && (
        <Box bg="white" p={4} borderRadius="lg" shadow="md">
          <VStack align="stretch" spacing={3}>
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="semibold">
                Step {currentStep + 1} of {steps.length}
              </Text>
              <Text fontSize="sm" color="gray.600" textTransform="capitalize">
                {currentStepData.type}
              </Text>
            </Flex>
            
            <Text fontSize="md">
              {currentStepData.description}
            </Text>

            <HStack spacing={8} fontSize="sm" color="gray.600">
              <Text>Comparisons: {currentStepData.statistics.comparisons}</Text>
              <Text>Current Depth: {currentStepData.statistics.depth}</Text>
              <Text>Nodes Visited: {currentStepData.statistics.nodesVisited}</Text>
            </HStack>

            {currentStepData.pathFromRoot.length > 0 && (
              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={1}>
                  Path from Root:
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {currentStepData.pathFromRoot.join(' → ')}
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      )}

      {/* Algorithm Explanation */}
      <Box bg="blue.50" p={4} borderRadius="lg" border="1px" borderColor="blue.200">
        <VStack align="stretch" spacing={3}>
          <Text fontSize="lg" fontWeight="semibold" color="blue.800">
            Binary Search Tree Operations
          </Text>
          <VStack align="stretch" spacing={2} fontSize="sm" color="blue.700">
            <Text>
              <strong>Search:</strong> Start at root, compare target with current node. 
              If equal, found! If less, go left; if greater, go right. Repeat until found or reach null.
            </Text>
            <Text>
              <strong>Insert:</strong> Similar to search, but when you reach a null position, 
              insert the new node there as a leaf.
            </Text>
            <Text>
              <strong>Time Complexity:</strong> O(log n) average case, O(n) worst case (unbalanced tree)
            </Text>
            <Text>
              <strong>Space Complexity:</strong> O(1) iterative, O(log n) recursive (call stack)
            </Text>
          </VStack>
        </VStack>
      </Box>
    </VStack>
  )
}

export default BinarySearchTreeDemo
