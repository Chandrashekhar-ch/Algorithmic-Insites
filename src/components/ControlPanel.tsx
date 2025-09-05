import React from 'react'
import {
  Box,
  Button,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  VStack,
  IconButton,
  Tooltip,
} from '@chakra-ui/react'
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
} from 'react-icons/fa'
import { useStore } from '../store/useStore'

const ControlPanel: React.FC = () => {
  const isPlaying = useStore((state) => state.isPlaying)
  const speed = useStore((state) => state.speed)
  const currentStepIndex = useStore((state) => state.currentStepIndex)
  const algorithmSteps = useStore((state) => state.algorithmSteps)
  
  const {
    play,
    pause,
    nextStep,
    prevStep,
    setSpeed,
  } = useStore((state) => ({
    play: state.play,
    pause: state.pause,
    nextStep: state.nextStep,
    prevStep: state.prevStep,
    setSpeed: state.setSpeed,
  }))

  const handlePlayPause = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }

  const handleSpeedChange = (value: number) => {
    setSpeed(value)
  }

  const isAtStart = currentStepIndex === 0
  const isAtEnd = currentStepIndex >= algorithmSteps.length - 1

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
      <VStack spacing={6}>
        {/* Playback Controls */}
        <HStack spacing={4}>
          <Tooltip label="Previous Step" placement="top">
            <IconButton
              aria-label="Previous step"
              icon={<FaStepBackward />}
              onClick={prevStep}
              isDisabled={isAtStart}
              variant="outline"
              colorScheme="blue"
              size="lg"
            />
          </Tooltip>

          <Tooltip label={isPlaying ? "Pause" : "Play"} placement="top">
            <IconButton
              aria-label={isPlaying ? "Pause" : "Play"}
              icon={isPlaying ? <FaPause /> : <FaPlay />}
              onClick={handlePlayPause}
              colorScheme="blue"
              size="lg"
              isDisabled={algorithmSteps.length === 0}
            />
          </Tooltip>

          <Tooltip label="Next Step" placement="top">
            <IconButton
              aria-label="Next step"
              icon={<FaStepForward />}
              onClick={nextStep}
              isDisabled={isAtEnd}
              variant="outline"
              colorScheme="blue"
              size="lg"
            />
          </Tooltip>
        </HStack>

        {/* Step Counter */}
        <Text fontSize="sm" color="gray.600">
          Step {currentStepIndex + 1} of {algorithmSteps.length || 1}
        </Text>

        {/* Speed Control */}
        <VStack spacing={2} w="full">
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            Speed: {(6000 - speed) / 1000}x
          </Text>
          <Slider
            aria-label="Playback speed"
            value={speed}
            min={100}
            max={5000}
            step={100}
            onChange={handleSpeedChange}
            colorScheme="blue"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          <HStack justify="space-between" w="full" fontSize="xs" color="gray.500">
            <Text>Slow</Text>
            <Text>Fast</Text>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  )
}

export default ControlPanel
