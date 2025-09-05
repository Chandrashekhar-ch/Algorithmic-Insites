import React, { useState, useEffect } from 'react'
import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useColorModeValue,
  Icon,
  Tooltip,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { FaCode, FaCheckCircle, FaTimesCircle, FaClock, FaExternalLinkAlt } from 'react-icons/fa'
import { codeExecutionService, type SupportedLanguage } from '../services/codeExecutionService'

interface CompilerStatusPanelProps {
  selectedLanguage?: SupportedLanguage
}

const CompilerStatusPanel: React.FC<CompilerStatusPanelProps> = ({ selectedLanguage = 'javascript' }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [environmentStatus, setEnvironmentStatus] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  useEffect(() => {
    const checkEnvironments = async () => {
      setIsLoading(true)
      const status = codeExecutionService.getEnvironmentStatus()
      setEnvironmentStatus(status)
      setIsLoading(false)
    }
    
    checkEnvironments()
  }, [])

  const getStatusBadge = (ready: boolean) => {
    return (
      <Badge
        colorScheme={ready ? 'green' : 'red'}
        variant="subtle"
        size="sm"
      >
        {ready ? (
          <HStack spacing={1}>
            <Icon as={FaCheckCircle} boxSize={3} />
            <Text>Ready</Text>
          </HStack>
        ) : (
          <HStack spacing={1}>
            <Icon as={FaTimesCircle} boxSize={3} />
            <Text>Not Ready</Text>
          </HStack>
        )}
      </Badge>
    )
  }

  const getLanguageIcon = (language: string) => {
    const icons: Record<string, string> = {
      javascript: '🟨',
      python: '🐍',
      cpp: '⚡',
      java: '☕',
      rust: '🦀',
      go: '🐹'
    }
    return icons[language] || '📝'
  }

  const currentStatus = environmentStatus[selectedLanguage]
  const isCurrentReady = currentStatus?.ready || false

  return (
    <>
      <Box
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        borderRadius="md"
        p={3}
        shadow="sm"
      >
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <HStack>
              <Icon as={FaCode} color="blue.500" />
              <Text fontSize="sm" fontWeight="semibold">
                Compiler Status
              </Text>
            </HStack>
            <HStack spacing={2}>
              <Text fontSize="xs" color="gray.600">
                {getLanguageIcon(selectedLanguage)} {selectedLanguage.toUpperCase()}
              </Text>
              {getStatusBadge(isCurrentReady)}
            </HStack>
          </VStack>
          
          <VStack align="end" spacing={1}>
            <Button
              size="xs"
              variant="outline"
              onClick={onOpen}
              rightIcon={<FaExternalLinkAlt />}
            >
              Details
            </Button>
            {currentStatus && (
              <Text fontSize="xs" color="gray.500">
                {currentStatus.method}
              </Text>
            )}
          </VStack>
        </HStack>

        {!isCurrentReady && (
          <Alert status="warning" size="sm" mt={2} borderRadius="md">
            <AlertIcon boxSize={3} />
            <Box fontSize="xs">
              <AlertTitle fontSize="xs">Compiler Not Ready!</AlertTitle>
              <AlertDescription fontSize="xs">
                {selectedLanguage === 'python' && 'Pyodide is loading...'}
                {(selectedLanguage === 'cpp' || selectedLanguage === 'java') && 'Online compilation service required'}
                {(selectedLanguage === 'rust' || selectedLanguage === 'go') && 'Not yet implemented'}
              </AlertDescription>
            </Box>
          </Alert>
        )}
      </Box>

      {/* Detailed Status Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack>
              <Icon as={FaCode} color="blue.500" />
              <Text>Code Execution Environment Status</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              
              {isLoading ? (
                <Box>
                  <Text mb={2}>Checking environments...</Text>
                  <Progress size="sm" isIndeterminate colorScheme="blue" />
                </Box>
              ) : (
                Object.entries(environmentStatus).map(([lang, status]: [string, any]) => (
                  <Box
                    key={lang}
                    p={4}
                    border="1px"
                    borderColor={status.ready ? 'green.200' : 'red.200'}
                    borderRadius="md"
                    bg={status.ready ? 'green.50' : 'red.50'}
                  >
                    <HStack justify="space-between" mb={2}>
                      <HStack>
                        <Text fontSize="lg">
                          {getLanguageIcon(lang)}
                        </Text>
                        <Text fontWeight="semibold" textTransform="uppercase">
                          {lang}
                        </Text>
                      </HStack>
                      {getStatusBadge(status.ready)}
                    </HStack>
                    
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      Execution Method: {status.method}
                    </Text>
                    
                    {lang === 'javascript' && (
                      <Text fontSize="xs" color="gray.500">
                        ✅ Native browser execution with secure sandboxing
                      </Text>
                    )}
                    
                    {lang === 'python' && (
                      <VStack align="start" spacing={1}>
                        <Text fontSize="xs" color="gray.500">
                          {status.ready 
                            ? '✅ Pyodide WebAssembly runtime loaded' 
                            : '⏳ Loading Pyodide (~3MB download)...'}
                        </Text>
                        {!status.ready && (
                          <Progress size="xs" isIndeterminate colorScheme="blue" />
                        )}
                      </VStack>
                    )}
                    
                    {(lang === 'cpp' || lang === 'java') && (
                      <VStack align="start" spacing={1}>
                        <Text fontSize="xs" color="gray.500">
                          🌐 Uses JDoodle API for compilation and execution
                        </Text>
                        <Text fontSize="xs" color="orange.500">
                          ⚠️ Requires API key configuration for production use
                        </Text>
                      </VStack>
                    )}
                    
                    {(lang === 'rust' || lang === 'go') && (
                      <Text fontSize="xs" color="gray.500">
                        🚧 Coming soon! Will support WASM compilation
                      </Text>
                    )}
                  </Box>
                ))
              )}

              <Box
                p={4}
                bg={useColorModeValue('blue.50', 'blue.900')}
                borderRadius="md"
              >
                <Text fontWeight="semibold" mb={2} color="blue.700">
                  📚 Execution Methods Explained:
                </Text>
                <VStack align="start" spacing={1} fontSize="xs" color="gray.600">
                  <Text>• <strong>Native Sandbox:</strong> Direct browser execution with security restrictions</Text>
                  <Text>• <strong>Pyodide WASM:</strong> Python runtime compiled to WebAssembly</Text>
                  <Text>• <strong>Online Compilation:</strong> Remote compilation services (JDoodle, Judge0)</Text>
                  <Text>• <strong>WASM Compilation:</strong> Compile-to-WebAssembly approach</Text>
                </VStack>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CompilerStatusPanel
