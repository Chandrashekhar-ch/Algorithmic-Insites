import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  Divider,
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { FaRobot, FaChartBar, FaRedo } from 'react-icons/fa'
import {
  getAIUsageStats,
  resetAIUsageStats,
  isAIAvailable,
  getCurrentAIModel,
  getAvailableAIModels,
  testAIConnection,
  type AIUsageStats
} from '../services/ollamaService'

const AIStatusPanel: React.FC = () => {
  const [stats, setStats] = useState<AIUsageStats | null>(null)
  const [isAvailable, setIsAvailable] = useState(false)
  const [currentModel, setCurrentModel] = useState('')
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; model: string } | null>(null)
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  const refreshStats = async () => {
    setIsRefreshing(true)
    try {
      const currentStats = getAIUsageStats()
      const available = isAIAvailable()
      const model = getCurrentAIModel()
      const models = getAvailableAIModels()
      
      setStats(currentStats)
      setIsAvailable(available)
      setCurrentModel(model)
      setAvailableModels(models)
    } catch (error) {
      console.error('Failed to refresh AI stats:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const handleReset = () => {
    resetAIUsageStats()
    refreshStats()
  }

  const handleTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)
    
    try {
      const result = await testAIConnection()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        model: currentModel
      })
    } finally {
      setIsTesting(false)
    }
  }

  const getSuccessRate = () => {
    if (!stats || stats.totalRequests === 0) return 0
    return Math.round((stats.successfulRequests / stats.totalRequests) * 100)
  }

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    return `${(ms / 1000).toFixed(1)}s`
  }

  const getStatusColor = () => {
    if (!isAvailable) return 'red'
    if (stats && stats.totalRequests > 0) return 'green'
    return 'yellow'
  }

  useEffect(() => {
    refreshStats()
    // Refresh stats every 30 seconds
    const interval = setInterval(refreshStats, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Box
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      p={4}
      shadow="sm"
    >
      <HStack justify="space-between" mb={4}>
        <HStack>
          <FaRobot size={20} color={getStatusColor() === 'green' ? '#48BB78' : getStatusColor() === 'yellow' ? '#ED8936' : '#F56565'} />
          <Text fontWeight="semibold" fontSize="lg">
            AI Assistant
          </Text>
          <Badge colorScheme={getStatusColor()} variant="solid">
            {isAvailable ? 'Online' : 'Offline'}
          </Badge>
        </HStack>
        
        <HStack>
          <Tooltip label="View detailed statistics">
            <IconButton
              aria-label="View stats"
              icon={<FaChartBar />}
              size="sm"
              variant="ghost"
              onClick={onOpen}
            />
          </Tooltip>
          <Tooltip label="Refresh status">
            <IconButton
              aria-label="Refresh"
              icon={<FaRedo />}
              size="sm"
              variant="ghost"
              isLoading={isRefreshing}
              onClick={refreshStats}
            />
          </Tooltip>
        </HStack>
      </HStack>

      {!isAvailable ? (
        <Alert status="warning" size="sm" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle fontSize="sm">AI Not Available</AlertTitle>
            <AlertDescription fontSize="xs">
              Make sure Ollama is running and a compatible model is installed.
            </AlertDescription>
          </Box>
        </Alert>
      ) : (
        <VStack spacing={3} align="stretch">
          <Box>
            <Text fontSize="sm" color={textColor} mb={1}>
              Current Model
            </Text>
            <Text fontSize="sm" fontWeight="medium">
              {currentModel || 'No model selected'}
            </Text>
          </Box>

          {stats && stats.totalRequests > 0 && (
            <>
              <Divider />
              <StatGroup>
                <Stat>
                  <StatLabel fontSize="xs">Requests</StatLabel>
                  <StatNumber fontSize="md">{stats.totalRequests}</StatNumber>
                  <StatHelpText fontSize="xs" mb={0}>
                    {stats.successfulRequests} successful
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel fontSize="xs">Success Rate</StatLabel>
                  <StatNumber fontSize="md">{getSuccessRate()}%</StatNumber>
                  <StatHelpText fontSize="xs" mb={0}>
                    <Progress 
                      value={getSuccessRate()} 
                      size="sm" 
                      colorScheme={getSuccessRate() > 80 ? 'green' : getSuccessRate() > 60 ? 'yellow' : 'red'}
                      borderRadius="sm"
                    />
                  </StatHelpText>
                </Stat>
              </StatGroup>
            </>
          )}
          
          {isAvailable && (
            <>
              <Button
                size="xs"
                colorScheme="blue"
                variant="outline"
                onClick={handleTestConnection}
                isLoading={isTesting}
                loadingText="Testing..."
              >
                Test AI Connection
              </Button>
              
              {testResult && (
                <Alert 
                  status={testResult.success ? 'success' : 'error'} 
                  size="sm" 
                  borderRadius="md"
                >
                  <AlertIcon />
                  <Box>
                    <AlertTitle fontSize="xs">
                      {testResult.success ? '✅ AI Test Passed' : '❌ AI Test Failed'}
                    </AlertTitle>
                    <AlertDescription fontSize="xs">
                      {testResult.message}
                    </AlertDescription>
                  </Box>
                </Alert>
              )}
            </>
          )}
        </VStack>
      )}

      {/* Detailed Statistics Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <FaRobot />
              <Text>AI Usage Statistics</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {stats ? (
              <VStack spacing={4} align="stretch">
                <Alert status="info" size="sm">
                  <AlertIcon />
                  <Text fontSize="sm">
                    Session started: {new Date(stats.sessionStart).toLocaleString()}
                  </Text>
                </Alert>

                <StatGroup>
                  <Stat>
                    <StatLabel>Total Requests</StatLabel>
                    <StatNumber>{stats.totalRequests}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Success Rate</StatLabel>
                    <StatNumber>{getSuccessRate()}%</StatNumber>
                  </Stat>
                </StatGroup>

                <StatGroup>
                  <Stat>
                    <StatLabel>Total Duration</StatLabel>
                    <StatNumber>{formatDuration(stats.totalDuration)}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Avg Response Time</StatLabel>
                    <StatNumber>
                      {stats.totalRequests > 0 
                        ? formatDuration(stats.totalDuration / stats.totalRequests)
                        : '0ms'
                      }
                    </StatNumber>
                  </Stat>
                </StatGroup>

                <Box>
                  <Text fontWeight="semibold" mb={2}>Available Models</Text>
                  <VStack align="stretch" spacing={1}>
                    {availableModels.map((model) => (
                      <HStack key={model} justify="space-between">
                        <Text fontSize="sm">{model}</Text>
                        <Badge 
                          colorScheme={model === currentModel ? 'blue' : 'gray'}
                          size="sm"
                        >
                          {model === currentModel ? 'Active' : 'Available'}
                        </Badge>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                {Object.keys(stats.modelUsage).length > 0 && (
                  <Box>
                    <Text fontWeight="semibold" mb={2}>Model Usage</Text>
                    <VStack align="stretch" spacing={1}>
                      {Object.entries(stats.modelUsage).map(([model, count]) => (
                        <HStack key={model} justify="space-between">
                          <Text fontSize="sm">{model}</Text>
                          <Badge size="sm">{count} requests</Badge>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                )}

                <HStack justify="space-between" pt={4}>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={handleReset}
                    leftIcon={<FaRedo />}
                  >
                    Reset Statistics
                  </Button>
                  <Text fontSize="xs" color={textColor}>
                    Last updated: {stats.lastUsed ? new Date(stats.lastUsed).toLocaleTimeString() : 'Never'}
                  </Text>
                </HStack>
              </VStack>
            ) : (
              <Alert status="info">
                <AlertIcon />
                <Text>No statistics available yet.</Text>
              </Alert>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default AIStatusPanel
