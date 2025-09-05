import React, { useEffect, useState } from 'react'
import {
  ChakraProvider,
  Box,
  Grid,
  GridItem,
  VStack,
  HStack,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import ControlPanel from './components/ControlPanel'
import DataInput from './components/DataInput'
import CodeInput from './components/CodeInput'
import MysticalVisualizationPanel from './components/MysticalVisualizationPanel'
import MetricsDisplay from './components/MetricsDisplay'
import ExplanationPanel from './components/ExplanationPanel'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import AIStatusPanel from './components/AIStatusPanel'
import ThemeToggle from './components/ThemeToggle'
import ParticleBackground from './components/ParticleBackground'
import OutputDisplay from './components/OutputDisplay'
import theme from './theme'
import {
  useStoreActions,
  useDataset,
  useIsPlaying,
  useSpeed,
} from './store/useStore'
import { getBubbleSortSteps, BubbleSortState } from './algorithms/bubbleSort'

const App: React.FC = () => {
  const { setAlgorithmSteps, nextStep } = useStoreActions()

  // Output display state
  const [showOutput, setShowOutput] = useState(false)
  const [executionOutput, setExecutionOutput] = useState('')
  const [executionError, setExecutionError] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)
  const [outputLanguage, setOutputLanguage] = useState('javascript')

  // Let CSS variables handle theming - no hard-coded colors
  // These will automatically switch based on data-theme attribute

  // Datasets and playback state
  const mainDataset = useDataset(false)
  const cmpDataset = useDataset(true)
  const mainIsPlaying = useIsPlaying(false)
  const cmpIsPlaying = useIsPlaying(true)
  const mainSpeed = useSpeed(false)
  const cmpSpeed = useSpeed(true)

  // Generate Bubble Sort steps when dataset changes (main)
  useEffect(() => {
    if (Array.isArray(mainDataset) && mainDataset.length > 0) {
      const steps = getBubbleSortSteps(mainDataset).map((s: BubbleSortState, idx: number) => ({
        id: `main-step-${idx}`,
        description: s.swappedIndices
          ? `Swapped indices ${s.swappedIndices[0]} and ${s.swappedIndices[1]}`
          : s.comparedIndices
          ? `Comparing indices ${s.comparedIndices[0]} and ${s.comparedIndices[1]}`
          : idx === 0
          ? 'Initial state'
          : 'State update',
        highlightedElements: [],
        comparingElements: s.comparedIndices ? [s.comparedIndices[0], s.comparedIndices[1]] : [],
        swappingElements: s.swappedIndices ? [s.swappedIndices[0], s.swappedIndices[1]] : [],
        data: s.arrayState,
      }))
      setAlgorithmSteps(steps, false)
    }
  }, [mainDataset, setAlgorithmSteps])

  // Generate Bubble Sort steps when dataset changes (comparison)
  useEffect(() => {
    if (Array.isArray(cmpDataset) && cmpDataset.length > 0) {
      const steps = getBubbleSortSteps(cmpDataset).map((s: BubbleSortState, idx: number) => ({
        id: `cmp-step-${idx}`,
        description: s.swappedIndices
          ? `Swapped indices ${s.swappedIndices[0]} and ${s.swappedIndices[1]}`
          : s.comparedIndices
          ? `Comparing indices ${s.comparedIndices[0]} and ${s.comparedIndices[1]}`
          : idx === 0
          ? 'Initial state'
          : 'State update',
        highlightedElements: [],
        comparingElements: s.comparedIndices ? [s.comparedIndices[0], s.comparedIndices[1]] : [],
        swappingElements: s.swappedIndices ? [s.swappedIndices[0], s.swappedIndices[1]] : [],
        data: s.arrayState,
      }))
      setAlgorithmSteps(steps, true)
    }
  }, [cmpDataset, setAlgorithmSteps])

  // Playback loop for main
  useEffect(() => {
    if (!mainIsPlaying) return
    const id = setInterval(() => {
      nextStep(false)
    }, Math.max(100, mainSpeed))
    return () => clearInterval(id)
  }, [mainIsPlaying, mainSpeed, nextStep])

  // Playback loop for comparison
  useEffect(() => {
    if (!cmpIsPlaying) return
    const id = setInterval(() => {
      nextStep(true)
    }, Math.max(100, cmpSpeed))
    return () => clearInterval(id)
  }, [cmpIsPlaying, cmpSpeed, nextStep])

  return (
    <ChakraProvider theme={theme}>
      <ParticleBackground />
      <PWAInstallPrompt />
      <Box minH="100vh" p={6} style={{ background: 'var(--bg-primary)' }}>
        <VStack spacing={8} maxW="1400px" mx="auto">
          {/* Header */}
          <Box 
            textAlign="center" 
            py={6} 
            px={8}
            borderRadius="20px"
            w="full"
            position="relative"
            className="glass-card floating"
            style={{ 
              background: 'var(--glass-bg)',
              backdropFilter: 'var(--backdrop-blur)',
              border: '1px solid var(--glass-border)',
              boxShadow: '0 8px 32px var(--shadow-color), 0 0 0 1px var(--glass-border) inset'
            }}
          >
            {/* Theme Toggle - Top Right */}
            <HStack position="absolute" top={4} right={4} spacing={2}>
              <ThemeToggle />
            </HStack>
            
            <Text fontSize="4xl" fontWeight="800" mb={3} className="gradient-text">
              Algorithmic Insights
            </Text>
            <Text fontSize="xl" mb={2} style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
              Interactive Algorithm Visualization Platform
            </Text>
            <Box className="pulse" mt={4}>
              <Text fontSize="sm" style={{ color: 'var(--text-accent)', fontWeight: '600' }}>
                ✨ Experience algorithms through mystical visualizations ✨
              </Text>
            </Box>
          </Box>

          {/* Main Content */}
          <Grid
            templateColumns="1fr 2fr 1fr"
            templateRows="auto auto"
            gap={6}
            w="full"
          >
            {/* Left Sidebar */}
            <GridItem rowSpan={2}>
              <VStack spacing={6}>
                <Tabs variant="soft-rounded" colorScheme="blue" w="full">
                  <TabList>
                    <Tab fontSize="sm">Quick Data</Tab>
                    <Tab fontSize="sm">Custom Code</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel px={0}>
                      <DataInput />
                    </TabPanel>
                    <TabPanel px={0}>
                      <CodeInput 
                        onExecutionStart={() => {
                          setShowOutput(true)
                          setIsExecuting(true)
                          setExecutionOutput('')
                          setExecutionError('')
                        }}
                        onExecutionComplete={(output, error, language) => {
                          setIsExecuting(false)
                          setExecutionOutput(output || '')
                          setExecutionError(error || '')
                          setOutputLanguage(language || 'javascript')
                        }}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
                <ControlPanel />
                
                {/* Output Display - Hidden by default, shown when code executes */}
                <OutputDisplay
                  isVisible={showOutput}
                  executionOutput={executionOutput}
                  executionError={executionError}
                  isExecuting={isExecuting}
                  language={outputLanguage}
                />
              </VStack>
            </GridItem>

            {/* Main Visualization Area */}
            <GridItem>
              <MysticalVisualizationPanel />
            </GridItem>

            {/* Right Sidebar */}
            <GridItem rowSpan={2}>
              <VStack spacing={6}>
                <AIStatusPanel />
                <MetricsDisplay algorithmType="bubble-sort" />
                <ExplanationPanel />
              </VStack>
            </GridItem>
          </Grid>

          {/* Footer */}
          <Box 
            textAlign="center" 
            pt={8} 
            pb={6}
            className="glass-card"
            borderRadius="16px"
            px={6}
            style={{ 
              background: 'var(--glass-bg)',
              backdropFilter: 'var(--backdrop-blur)',
              border: '1px solid var(--glass-border)'
            }}
          >
            <Text fontSize="sm" style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
              🚀 Built with React, TypeScript, D3.js, Chakra UI, and Zustand
            </Text>
            <Text fontSize="xs" mt={2} style={{ color: 'var(--text-accent)', fontWeight: '600' }}>
              Crafted with ❤️ for algorithmic learning
            </Text>
          </Box>
        </VStack>
      </Box>
    </ChakraProvider>
  )
}

export default App
