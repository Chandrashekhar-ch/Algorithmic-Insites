import React from 'react'
import {
  Box,
  VStack,
  Text,
  HStack,
  Badge,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
} from '@chakra-ui/react'
import { useStore, useCurrentStep } from '../store/useStore'
import { useAlgorithmStore } from '../store/algorithmStore'

// Algorithm Big O complexities
const ALGORITHM_COMPLEXITIES = {
  'bubble-sort': { time: 'O(n²)', space: 'O(1)', name: 'Bubble Sort' },
  'selection-sort': { time: 'O(n²)', space: 'O(1)', name: 'Selection Sort' },
  'insertion-sort': { time: 'O(n²)', space: 'O(1)', name: 'Insertion Sort' },
  'merge-sort': { time: 'O(n log n)', space: 'O(n)', name: 'Merge Sort' },
  'quick-sort': { time: 'O(n log n)', space: 'O(log n)', name: 'Quick Sort' },
  'heap-sort': { time: 'O(n log n)', space: 'O(1)', name: 'Heap Sort' },
  'linear-search': { time: 'O(n)', space: 'O(1)', name: 'Linear Search' },
  'binary-search': { time: 'O(log n)', space: 'O(1)', name: 'Binary Search' },
  'big-o': { time: 'O(1) to O(n!)', space: 'O(1) to O(n)', name: 'Big O Analysis' },
  'bfs-network': { time: 'O(V + E)', space: 'O(V)', name: 'BFS Network' },
  'sorting-bars': { time: 'O(n²)', space: 'O(1)', name: 'Sorting Algorithm' },
  'stack': { time: 'O(1)', space: 'O(n)', name: 'Stack Operations' },
  'queue': { time: 'O(1)', space: 'O(n)', name: 'Queue Operations' },
  'binary-tree': { time: 'O(log n)', space: 'O(h)', name: 'Binary Tree' },
  'array': { time: 'O(1)', space: 'O(n)', name: 'Array Access' },
  'linked-list': { time: 'O(n)', space: 'O(n)', name: 'Linked List' },
  'hash-table': { time: 'O(1)', space: 'O(n)', name: 'Hash Table' },
} as const

interface MetricsDisplayProps {
  algorithmType?: keyof typeof ALGORITHM_COMPLEXITIES
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ 
  algorithmType 
}) => {
  const currentStep = useCurrentStep()
  const currentStepIndex = useStore((state) => state.currentStepIndex)
  const algorithmSteps = useStore((state) => state.algorithmSteps)
  const dataset = useStore((state) => state.dataset)
  
  // Get the current algorithm from the algorithm store
  const { algorithm } = useAlgorithmStore()
  
  // Determine which algorithm type to show - prioritize mystical visualizations
  const displayAlgorithmType = algorithm !== 'none' ? algorithm as keyof typeof ALGORITHM_COMPLEXITIES : algorithmType || 'bubble-sort'
  
  // Get algorithm info
  const algorithmInfo = ALGORITHM_COMPLEXITIES[displayAlgorithmType] || ALGORITHM_COMPLEXITIES['bubble-sort']

  // Calculate cumulative metrics up to current step
  const calculateCumulativeMetrics = () => {
    let totalComparisons = 0
    let totalSwaps = 0
    let totalAccesses = 0

    for (let i = 0; i <= currentStepIndex && i < algorithmSteps.length; i++) {
      const step = algorithmSteps[i]
      
      // Check if step exists
      if (!step) continue
      
      // Count comparisons
      if (step.comparingElements && step.comparingElements.length > 0) {
        totalComparisons++
      }
      
      // Count swaps
      if (step.swappingElements && step.swappingElements.length > 0) {
        totalSwaps++
      }
      
      // Count array accesses (highlighted + comparing + swapping elements)
      const accessedElements = new Set([
        ...(step.highlightedElements || []),
        ...(step.comparingElements || []),
        ...(step.swappingElements || []),
      ])
      totalAccesses += accessedElements.size
    }

    return { totalComparisons, totalSwaps, totalAccesses }
  }

  const { totalComparisons, totalSwaps, totalAccesses } = calculateCumulativeMetrics()
  const progress = algorithmSteps.length > 0 ? 
    ((currentStepIndex + 1) / algorithmSteps.length * 100).toFixed(1) : 0

  return (
    <Box
      p={6}
      bg="white"
      borderRadius="lg"
      shadow="md"
      border="1px"
      borderColor="gray.200"
      w="full"
      maxW="md"
    >
      <VStack spacing={4} align="stretch">
        {/* Algorithm Info */}
        <VStack spacing={2} align="stretch">
          <Text fontSize="lg" fontWeight="semibold" color="gray.700">
            Algorithm Metrics
          </Text>
          
          <HStack justify="space-between" align="center">
            <Text fontSize="md" fontWeight="medium" color="gray.600">
              {algorithmInfo.name}
            </Text>
            <Badge colorScheme="blue" fontSize="sm">
              {algorithmSteps.length > 0 ? 'Running' : 'Ready'}
            </Badge>
          </HStack>
        </VStack>

        <Divider />

        {/* Complexity Analysis */}
        <VStack spacing={3} align="stretch">
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            Complexity Analysis
          </Text>
          
          <HStack justify="space-between">
            <VStack spacing={1} align="start">
              <Text fontSize="xs" color="gray.500">Time Complexity</Text>
              <Text fontSize="sm" fontWeight="semibold" color="orange.600">
                {algorithmInfo.time}
              </Text>
            </VStack>
            
            <VStack spacing={1} align="end">
              <Text fontSize="xs" color="gray.500">Space Complexity</Text>
              <Text fontSize="sm" fontWeight="semibold" color="purple.600">
                {algorithmInfo.space}
              </Text>
            </VStack>
          </HStack>
        </VStack>

        <Divider />

        {/* Performance Metrics */}
        <VStack spacing={3} align="stretch">
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            Performance Metrics
          </Text>
          
          <StatGroup>
            <Stat>
              <StatLabel fontSize="xs">Comparisons</StatLabel>
              <StatNumber fontSize="lg" color="blue.600">
                {totalComparisons}
              </StatNumber>
            </Stat>
            
            <Stat>
              <StatLabel fontSize="xs">Swaps</StatLabel>
              <StatNumber fontSize="lg" color="green.600">
                {totalSwaps}
              </StatNumber>
            </Stat>
          </StatGroup>
          
          <StatGroup>
            <Stat>
              <StatLabel fontSize="xs">Array Accesses</StatLabel>
              <StatNumber fontSize="lg" color="purple.600">
                {totalAccesses}
              </StatNumber>
            </Stat>
            
            <Stat>
              <StatLabel fontSize="xs">Progress</StatLabel>
              <StatNumber fontSize="lg" color="orange.600">
                {progress}%
              </StatNumber>
            </Stat>
          </StatGroup>
        </VStack>

        <Divider />

        {/* Current Step Info */}
        <VStack spacing={2} align="stretch">
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            Current Step
          </Text>
          
          <Text fontSize="sm" color="gray.600">
            {currentStep?.description || 'No algorithm running'}
          </Text>
          
          {dataset.length > 0 && (
            <HStack justify="space-between">
              <Text fontSize="xs" color="gray.500">
                Dataset Size: {dataset.length}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Step: {currentStepIndex + 1}/{algorithmSteps.length || 1}
              </Text>
            </HStack>
          )}
        </VStack>
      </VStack>
    </Box>
  )
}

export default MetricsDisplay
