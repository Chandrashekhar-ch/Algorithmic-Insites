import React, { useState, useEffect } from 'react'
import {
  Box,
  Text,
  Spinner,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  HStack,
  Icon,
} from '@chakra-ui/react'
import { FaRobot, FaSync } from 'react-icons/fa'
import { useStore, useCurrentStep } from '../store/useStore'
import { getAlgorithmExplanation, checkOllamaAvailability } from '../services/ollamaService'

const ExplanationPanel: React.FC = () => {
  const [explanation, setExplanation] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [isOllamaAvailable, setIsOllamaAvailable] = useState<boolean | null>(null)

  // Subscribe to store state
  const currentStepIndex = useStore((state) => state.currentStepIndex)
  const currentStep = useCurrentStep()
  const algorithmSteps = useStore((state) => state.algorithmSteps)

  // Check Ollama availability on mount
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const available = await checkOllamaAvailability()
        setIsOllamaAvailable(available)
      } catch {
        setIsOllamaAvailable(false)
      }
    }

    checkAvailability()
  }, [])

  // Fetch explanation when current step changes
  useEffect(() => {
    const fetchExplanation = async () => {
      // Reset state
      setError('')
      
      // Check if we have a valid current step
      if (!currentStep || algorithmSteps.length === 0) {
        setExplanation('')
        return
      }

      // Check if Ollama is available
      if (isOllamaAvailable === false) {
        setExplanation('')
        return
      }

      setIsLoading(true)

      try {
        const explanation = await getAlgorithmExplanation({
          algorithmName: 'Bubble Sort', // TODO: Make this dynamic based on selected algorithm
          currentStep
        })
        
        setExplanation(explanation)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get explanation'
        setError(errorMessage)
        setExplanation('')
      } finally {
        setIsLoading(false)
      }
    }

    // Only fetch if Ollama availability check is complete
    if (isOllamaAvailable !== null) {
      fetchExplanation()
    }
  }, [currentStepIndex, currentStep, algorithmSteps.length, isOllamaAvailable])

  const handleRetry = async () => {
    if (!currentStep) return
    
    setError('')
    setIsLoading(true)
    
    try {
      const explanation = await getAlgorithmExplanation({
        algorithmName: 'Bubble Sort',
        currentStep
      })
      
      setExplanation(explanation)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get explanation'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckOllama = async () => {
    setIsLoading(true)
    try {
      const available = await checkOllamaAvailability()
      setIsOllamaAvailable(available)
      if (available && currentStep) {
        // Automatically fetch explanation if Ollama becomes available
        const explanation = await getAlgorithmExplanation({
          algorithmName: 'Bubble Sort',
          currentStep
        })
        setExplanation(explanation)
      }
    } catch {
      setIsOllamaAvailable(false)
    } finally {
      setIsLoading(false)
    }
  }

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
        {/* Header */}
        <HStack justify="space-between" align="center">
          <HStack spacing={2}>
            <Icon as={FaRobot} color="blue.500" />
            <Text fontSize="lg" fontWeight="semibold" color="gray.700">
              AI Explanation
            </Text>
          </HStack>
          
          {error && (
            <Button
              size="sm"
              variant="ghost"
              colorScheme="blue"
              leftIcon={<FaSync />}
              onClick={handleRetry}
              isLoading={isLoading}
            >
              Retry
            </Button>
          )}
        </HStack>

        {/* Ollama Availability Check */}
        {isOllamaAvailable === false && (
          <Alert status="warning" size="sm">
            <AlertIcon />
            <Box>
              <AlertTitle fontSize="sm">Ollama Not Available</AlertTitle>
              <AlertDescription fontSize="xs">
                Ollama is not running or the model is not installed. 
                <Button
                  size="xs"
                  variant="link"
                  colorScheme="blue"
                  onClick={handleCheckOllama}
                  ml={1}
                  isLoading={isLoading}
                >
                  Check Again
                </Button>
              </AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Error Display */}
        {error && (
          <Alert status="error" size="sm">
            <AlertIcon />
            <Box>
              <AlertTitle fontSize="sm">Explanation Error</AlertTitle>
              <AlertDescription fontSize="xs">{error}</AlertDescription>
            </Box>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading && (
          <HStack justify="center" py={4}>
            <Spinner size="sm" color="blue.500" />
            <Text fontSize="sm" color="gray.600">
              Generating explanation...
            </Text>
          </HStack>
        )}

        {/* Explanation Content */}
        {!isLoading && explanation && (
          <Box
            p={4}
            bg="blue.50"
            borderRadius="md"
            border="1px"
            borderColor="blue.200"
          >
            <Text
              fontSize="sm"
              lineHeight="tall"
              color="gray.700"
              whiteSpace="pre-wrap"
            >
              {explanation}
            </Text>
          </Box>
        )}

        {/* No Content State */}
        {!isLoading && !explanation && !error && isOllamaAvailable && algorithmSteps.length === 0 && (
          <Box
            p={4}
            bg="gray.50"
            borderRadius="md"
            border="1px"
            borderColor="gray.200"
            textAlign="center"
          >
            <Text fontSize="sm" color="gray.500">
              Start an algorithm to see AI-powered explanations of each step.
            </Text>
          </Box>
        )}

        {/* Step Info */}
        {currentStep && (
          <Box
            p={3}
            bg="gray.50"
            borderRadius="md"
            border="1px"
            borderColor="gray.200"
          >
            <Text fontSize="xs" fontWeight="medium" color="gray.600" mb={1}>
              Current Step:
            </Text>
            <Text fontSize="sm" color="gray.700">
              {currentStep.description}
            </Text>
          </Box>
        )}

        {/* Footer Info */}
        <Text fontSize="xs" color="gray.400" textAlign="center">
          💡 Powered by Ollama AI • Explanations generated in real-time
        </Text>
      </VStack>
    </Box>
  )
}

export default ExplanationPanel
