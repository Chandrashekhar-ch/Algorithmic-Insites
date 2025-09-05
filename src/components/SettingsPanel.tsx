import React from 'react'
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Switch,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Icon,
  Badge,
  Tooltip,
} from '@chakra-ui/react'
import { FaCog, FaSun, FaMoon, FaPalette, FaDesktop } from 'react-icons/fa'

const SettingsPanel: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { colorMode, toggleColorMode } = useColorMode()
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const headerBg = useColorModeValue('gray.50', 'gray.700')

  const getThemeIcon = () => {
    return colorMode === 'dark' ? FaMoon : FaSun
  }

  const getThemeColor = () => {
    return colorMode === 'dark' ? 'purple' : 'orange'
  }

  const getThemeLabel = () => {
    return colorMode === 'dark' ? 'Dark Mode' : 'Light Mode'
  }

  return (
    <>
      {/* Settings Button */}
      <Tooltip 
        label="Application Settings" 
        placement="bottom"
        hasArrow
      >
        <Button
          onClick={onOpen}
          size="sm"
          variant="ghost"
          colorScheme="gray"
          leftIcon={<Icon as={FaCog} />}
        >
          Settings
        </Button>
      </Tooltip>

      {/* Settings Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent
          bg={bgColor}
          border="1px"
          borderColor={borderColor}
          shadow="2xl"
        >
          <ModalHeader
            bg={headerBg}
            borderBottom="1px"
            borderColor={borderColor}
            borderTopRadius="md"
          >
            <HStack>
              <Icon as={FaCog} color="blue.500" />
              <Text>Application Settings</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody py={6}>
            <VStack spacing={6} align="stretch">
              
              {/* Theme Section */}
              <Box>
                <HStack mb={4} justify="space-between">
                  <HStack>
                    <Icon as={FaPalette} color="blue.500" />
                    <Text fontWeight="semibold" fontSize="lg">
                      Appearance
                    </Text>
                  </HStack>
                  <Badge 
                    colorScheme={getThemeColor()} 
                    variant="subtle"
                    px={2}
                    py={1}
                    borderRadius="full"
                  >
                    {getThemeLabel()}
                  </Badge>
                </HStack>

                {/* Theme Toggle */}
                <Box
                  p={4}
                  border="1px"
                  borderColor={borderColor}
                  borderRadius="md"
                  bg={useColorModeValue('gray.50', 'gray.700')}
                >
                  <HStack justify="space-between" align="center">
                    <VStack align="start" spacing={1}>
                      <HStack>
                        <Icon 
                          as={getThemeIcon()} 
                          color={getThemeColor() + '.500'} 
                          boxSize={5}
                        />
                        <Text fontWeight="medium">
                          Theme Switcher
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        Toggle between light and dark mode
                      </Text>
                    </VStack>
                    
                    <Switch
                      isChecked={colorMode === 'dark'}
                      onChange={toggleColorMode}
                      colorScheme={getThemeColor()}
                      size="lg"
                    />
                  </HStack>
                </Box>

                {/* Theme Options Display */}
                <HStack mt={4} spacing={4}>
                  <Box
                    p={3}
                    border="2px"
                    borderColor={colorMode === 'light' ? 'orange.500' : 'gray.300'}
                    borderRadius="md"
                    bg="white"
                    cursor="pointer"
                    onClick={() => colorMode === 'dark' && toggleColorMode()}
                    transition="all 0.2s"
                    _hover={{ transform: 'scale(1.05)' }}
                  >
                    <VStack spacing={2}>
                      <Icon as={FaSun} color="orange.500" boxSize={6} />
                      <Text fontSize="sm" fontWeight="medium" color="gray.800">
                        Light
                      </Text>
                    </VStack>
                  </Box>

                  <Box
                    p={3}
                    border="2px"
                    borderColor={colorMode === 'dark' ? 'purple.500' : 'gray.300'}
                    borderRadius="md"
                    bg="gray.800"
                    cursor="pointer"
                    onClick={() => colorMode === 'light' && toggleColorMode()}
                    transition="all 0.2s"
                    _hover={{ transform: 'scale(1.05)' }}
                  >
                    <VStack spacing={2}>
                      <Icon as={FaMoon} color="purple.400" boxSize={6} />
                      <Text fontSize="sm" fontWeight="medium" color="white">
                        Dark
                      </Text>
                    </VStack>
                  </Box>
                </HStack>
              </Box>

              <Divider />

              {/* Quick Actions */}
              <Box>
                <HStack mb={4}>
                  <Icon as={FaDesktop} color="blue.500" />
                  <Text fontWeight="semibold" fontSize="lg">
                    Quick Actions
                  </Text>
                </HStack>

                <VStack spacing={3}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleColorMode}
                    leftIcon={<Icon as={getThemeIcon()} />}
                    colorScheme={getThemeColor()}
                    w="full"
                  >
                    Switch to {colorMode === 'dark' ? 'Light' : 'Dark'} Mode
                  </Button>
                  
                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    You can also press the theme toggle above or use keyboard shortcuts
                  </Text>
                </VStack>
              </Box>

              <Divider />

              {/* Info Section */}
              <Box>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  🎨 <strong>Default:</strong> Dark mode is set as the default theme
                  <br />
                  💡 <strong>Tip:</strong> Your preference will be remembered across sessions
                </Text>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SettingsPanel
