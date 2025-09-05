import React from 'react'
import { ChakraProvider, Box, Text } from '@chakra-ui/react'

const TestApp: React.FC = () => {
  return (
    <ChakraProvider>
      <Box p={8}>
        <Text fontSize="2xl" color="blue.500">
          Test - Algorithmic Insights Loading...
        </Text>
        <Text mt={4}>
          If you can see this, React and Chakra UI are working properly.
        </Text>
      </Box>
    </ChakraProvider>
  )
}

export default TestApp
