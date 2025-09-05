import React, { useState } from 'react'
import {
  Box,
  Button,
  Textarea,
  VStack,
  HStack,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
  useToast,
} from '@chakra-ui/react'
import { FaRandom, FaCheck } from 'react-icons/fa'
import { useStore } from '../store/useStore'

const DataInput: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('')
  const [error, setError] = useState<string>('')
  
  const dataset = useStore((state) => state.dataset)
  const setDataset = useStore((state) => state.setDataset)
  
  const toast = useToast()

  const validateAndParseInput = (input: string): number[] | null => {
    if (!input.trim()) {
      setError('Please enter some data')
      return null
    }

    try {
      // Split by comma and trim whitespace
      const values = input.split(',').map(item => item.trim())
      
      // Check for empty values
      if (values.some(value => value === '')) {
        setError('Please remove empty values (consecutive commas)')
        return null
      }

      // Parse to numbers
      const numbers = values.map(value => {
        const num = Number(value)
        if (isNaN(num)) {
          throw new Error(`"${value}" is not a valid number`)
        }
        return num
      })

      if (numbers.length === 0) {
        setError('Please enter at least one number')
        return null
      }

      if (numbers.length > 50) {
        setError('Please enter no more than 50 numbers for better visualization')
        return null
      }

      setError('')
      return numbers
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input format')
      return null
    }
  }

  const handleSubmit = () => {
    const parsedData = validateAndParseInput(inputValue)
    if (parsedData) {
      setDataset(parsedData)
      toast({
        title: 'Data updated',
        description: `Successfully loaded ${parsedData.length} numbers`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  const generateRandomData = () => {
    const randomData = Array.from({ length: 10 }, () => 
      Math.floor(Math.random() * 100) + 1
    )
    
    setDataset(randomData)
    setInputValue(randomData.join(', '))
    setError('')
    
    toast({
      title: 'Random data generated',
      description: 'Generated 10 random numbers between 1-100',
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value)
    // Clear error when user starts typing
    if (error) {
      setError('')
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault()
      handleSubmit()
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
        <Text fontSize="lg" fontWeight="semibold" color="gray.700">
          Data Input
        </Text>
        
        <VStack spacing={3} align="stretch">
          <Text fontSize="sm" color="gray.600">
            Enter numbers separated by commas (e.g., 5, 2, 8, 1, 9)
          </Text>
          
          <Textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="5, 2, 8, 1, 9, 3, 7, 4, 6"
            rows={3}
            resize="vertical"
            focusBorderColor="blue.500"
          />
          
          {error && (
            <Alert status="error" size="sm">
              <AlertIcon />
              <AlertDescription fontSize="sm">{error}</AlertDescription>
            </Alert>
          )}
          
          <HStack spacing={3}>
            <Button
              onClick={handleSubmit}
              colorScheme="blue"
              leftIcon={<FaCheck />}
              flex={1}
              isDisabled={!inputValue.trim()}
            >
              Apply Data
            </Button>
            
            <Button
              onClick={generateRandomData}
              variant="outline"
              colorScheme="blue"
              leftIcon={<FaRandom />}
              flex={1}
            >
              Random Data
            </Button>
          </HStack>
        </VStack>

        {dataset.length > 0 && (
          <Box
            p={3}
            bg="gray.50"
            borderRadius="md"
            border="1px"
            borderColor="gray.200"
          >
            <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
              Current Dataset ({dataset.length} numbers):
            </Text>
            <Text fontSize="sm" color="gray.600" wordBreak="break-all">
              {dataset.join(', ')}
            </Text>
          </Box>
        )}
        
        <Text fontSize="xs" color="gray.500">
          💡 Tip: Press Ctrl+Enter to quickly apply data
        </Text>
      </VStack>
    </Box>
  )
}

export default DataInput
