import React, { useEffect } from 'react'
import {
  ChakraProvider,
  Box,
  Grid,
  GridItem,
  VStack,
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
import {
  useStoreActions,
  useDataset,
  useIsPlaying,
  useSpeed,
} from './store/useStore'
import { getBubbleSortSteps, BubbleSortState } from './algorithms/bubbleSort'

const App: React.FC = () => {
  const { setAlgorithmSteps, nextStep } = useStoreActions()

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
    <ChakraProvider>
      <PWAInstallPrompt />
      <Box minH="100vh" bg="gray.50" p={6}>
        <VStack spacing={6} maxW="1400px" mx="auto">
          {/* Header */}
          <Box textAlign="center" py={4}>
            <Text fontSize="3xl" fontWeight="bold" color="gray.800" mb={2}>
              Algorithmic Insights
            </Text>
            <Text fontSize="lg" color="gray.600" mb={4}>
              Interactive Algorithm Visualization Platform
            </Text>
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
                      <CodeInput />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
                <ControlPanel />
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
          <Box textAlign="center" pt={8} pb={4}>
            <Text fontSize="sm" color="gray.500">
              Built with React, TypeScript, D3.js, Chakra UI, and Zustand
            </Text>
          </Box>
        </VStack>
      </Box>
    </ChakraProvider>
  )
}

export default App
