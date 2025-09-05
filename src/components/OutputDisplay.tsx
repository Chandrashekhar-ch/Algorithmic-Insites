import React from 'react'
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Textarea,
  Divider,
  Alert,
  AlertIcon,
  AlertDescription,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react'
import { FaCode, FaEye, FaEyeSlash, FaCopy, FaTrash } from 'react-icons/fa'

interface OutputDisplayProps {
  isVisible?: boolean
  executionOutput?: string
  executionError?: string
  isExecuting?: boolean
  language?: string
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({
  isVisible = false,
  executionOutput = '',
  executionError = '',
  isExecuting = false,
  language = 'javascript'
}) => {
  const { isOpen: isExpanded, onToggle } = useDisclosure({ defaultIsOpen: true })
  
  const handleCopyOutput = () => {
    if (executionOutput || executionError) {
      navigator.clipboard.writeText(executionOutput || executionError)
    }
  }

  const handleClearOutput = () => {
    // This will be connected to a store action to clear output
    console.log('Clear output requested')
  }

  if (!isVisible) {
    return null
  }

  return (
    <Box
      borderRadius="lg"
      shadow="md"
      border="1px"
      w="full"
      maxW="md"
      style={{
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)'
      }}
      className="output-display-box"
    >
      <VStack spacing={0} align="stretch">
        {/* Header */}
        <HStack
          p={4}
          justify="space-between"
          align="center"
          borderBottom="1px"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <HStack spacing={3}>
            <FaCode style={{ color: 'var(--text-accent)' }} />
            <Text fontSize="lg" fontWeight="semibold" style={{ color: 'var(--text-primary)' }}>
              Code Output
            </Text>
            <Badge colorScheme={language === 'python' ? 'green' : language === 'cpp' ? 'purple' : 'blue'} fontSize="xs">
              {language.toUpperCase()}
            </Badge>
          </HStack>
          
          <HStack spacing={2}>
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggle}
              leftIcon={isExpanded ? <FaEyeSlash /> : <FaEye />}
              style={{ color: 'var(--text-secondary)' }}
            >
              {isExpanded ? 'Hide' : 'Show'}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopyOutput}
              leftIcon={<FaCopy />}
              isDisabled={!executionOutput && !executionError}
              style={{ color: 'var(--text-secondary)' }}
            >
              Copy
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClearOutput}
              leftIcon={<FaTrash />}
              isDisabled={!executionOutput && !executionError}
              style={{ color: 'var(--text-secondary)' }}
            >
              Clear
            </Button>
          </HStack>
        </HStack>

        {/* Content */}
        <Collapse in={isExpanded}>
          <VStack spacing={4} p={4} align="stretch">
            {/* Execution Status */}
            <HStack justify="space-between" align="center">
              <Text fontSize="sm" style={{ color: 'var(--text-secondary)' }}>
                Status:
              </Text>
              <Badge 
                colorScheme={isExecuting ? 'yellow' : executionError ? 'red' : 'green'} 
                variant="subtle"
              >
                {isExecuting ? 'Executing...' : executionError ? 'Error' : 'Completed'}
              </Badge>
            </HStack>

            <Divider />

            {/* Output Content */}
            {isExecuting && (
              <Alert status="info" size="sm">
                <AlertIcon />
                <AlertDescription fontSize="sm">
                  Code is executing, please wait...
                </AlertDescription>
              </Alert>
            )}

            {executionError && (
              <Alert status="error" size="sm">
                <AlertIcon />
                <AlertDescription fontSize="sm">
                  Execution failed with error
                </AlertDescription>
              </Alert>
            )}

            {/* Output Display */}
            <VStack spacing={2} align="stretch">
              <Text fontSize="sm" fontWeight="medium" style={{ color: 'var(--text-primary)' }}>
                {executionError ? 'Error Output:' : 'Program Output:'}
              </Text>
              
              <Textarea
                value={executionError || executionOutput || (isExecuting ? 'Executing...' : 'No output yet')}
                readOnly
                resize="vertical"
                minHeight="120px"
                maxHeight="300px"
                fontSize="sm"
                fontFamily="monospace"
                style={{
                  background: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-color)',
                  color: executionError ? '#e53e3e' : 'var(--text-primary)'
                }}
                placeholder="Output will appear here after code execution..."
              />
            </VStack>

            {/* Execution Info */}
            {(executionOutput || executionError) && (
              <Box
                p={3}
                borderRadius="md"
                border="1px"
                style={{
                  background: 'var(--bg-tertiary)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <HStack justify="space-between" fontSize="xs" style={{ color: 'var(--text-secondary)' }}>
                  <Text>Output Length: {(executionOutput || executionError).length} characters</Text>
                  <Text>Executed at: {new Date().toLocaleTimeString()}</Text>
                </HStack>
              </Box>
            )}
          </VStack>
        </Collapse>
      </VStack>
    </Box>
  )
}

export default OutputDisplay
