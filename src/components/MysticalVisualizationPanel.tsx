import React, { useState, useRef } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Button, 
  Text, 
  Select, 
  useColorModeValue, 
  Icon, 
  FormControl,
  FormLabel 
} from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa';
import { useAlgorithmStore } from '../store/algorithmStore';
import * as d3 from 'd3';

const MysticalVisualizationPanel: React.FC = () => {
  // Mystical Visualization states and functions
  const [mysticalVisualizationType, setMysticalVisualizationType] = useState<string>('');
  const [isMysticalGenerating, setIsMysticalGenerating] = useState(false);
  const mysticalVisualizationRef = useRef<HTMLDivElement>(null);

  // Get data from the algorithm store (connected to left sidebar)
  const { dataset, setAlgorithm } = useAlgorithmStore();

  // Mystical visualization theme
  const mysticalTheme = {
    background: '#0a0a0a',
    primary: '#00bfff',      // Electric blue
    secondary: '#40e0d0',    // Cyan
    inactive: '#404040',     // Grey
    text: '#ffffff',
    accent: '#ff6b6b',
    glow: '#00bfff80'
  };

  const generateMysticalVisualization = () => {
    if (!mysticalVisualizationType || !mysticalVisualizationRef.current) return;

    // Update the algorithm type in the store
    setAlgorithm(mysticalVisualizationType);

    setIsMysticalGenerating(true);
    
    setTimeout(() => {
      if (mysticalVisualizationRef.current) {
        createMysticalVisualization(mysticalVisualizationRef.current);
      }
      setIsMysticalGenerating(false);
    }, 500);
  };

  const createMysticalVisualization = (container: HTMLElement) => {
    // Clear existing content
    d3.select(container).selectAll('*').remove();

    switch (mysticalVisualizationType) {
      case 'big_o':
        createBigOVisualization(container);
        break;
      case 'bfs_network':
        createBFSNetworkVisualization(container);
        break;
      case 'sorting_bars':
        createSortingVisualization(container);
        break;
      case 'stack':
        createStackVisualization(container);
        break;
      case 'queue':
        createQueueVisualization(container);
        break;
      case 'binary_tree':
        createBinaryTreeVisualization(container);
        break;
      case 'array_boxes':
        createArrayVisualization(container);
        break;
      case 'linked_list':
        createLinkedListVisualization(container);
        break;
      case 'hash_table':
        createHashTableVisualization(container);
        break;
      default:
        createBigOVisualization(container);
    }
  };

  const createBigOVisualization = (container: HTMLElement) => {
    const width = 800;
    const height = 500;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', mysticalTheme.background)
      .style('border-radius', '12px');

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', mysticalTheme.primary)
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .text('🚀 Big O Notation - Mystical Complexity Universe');

    // Add description
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', mysticalTheme.secondary)
      .style('font-size', '16px')
      .text(`Mystical complexity curves with ${dataset.length} data points`);
  };

  const createBFSNetworkVisualization = (container: HTMLElement) => {
    const width = 800;
    const height = 600;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', mysticalTheme.background)
      .style('border-radius', '12px');

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', mysticalTheme.primary)
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .text('🌐 Mystical BFS Network - Crystalline Orbs');

    // Create network based on dataset
    const nodeCount = Math.min(dataset.length, 10);
    const nodes = dataset.slice(0, nodeCount).map((value, i) => ({
      x: Math.random() * (width - 100) + 50,
      y: Math.random() * (height - 100) + 50,
      id: i,
      value: value
    }));

    svg.selectAll('.node')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => Math.max(10, d.value / 10))
      .attr('fill', d => d.id === 0 ? mysticalTheme.primary : mysticalTheme.secondary)
      .attr('stroke', mysticalTheme.text)
      .attr('stroke-width', 2);

    // Add value labels
    svg.selectAll('.label')
      .data(nodes)
      .enter()
      .append('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', mysticalTheme.text)
      .style('font-size', '12px')
      .text(d => d.value);
  };

  const createSortingVisualization = (container: HTMLElement) => {
    const width = 800;
    const height = 400;

    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', mysticalTheme.background)
      .style('border-radius', '12px');

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', mysticalTheme.primary)
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .text('📊 Mystical Sorting - Bar Chart Race');

    // Use actual dataset for visualization
    const data = dataset.length > 0 ? dataset : [64, 34, 25, 12, 22, 11, 90];

    const xScale = d3.scaleBand()
      .domain(data.map((_, i) => i.toString()))
      .range([50, width - 50])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, Math.max(...data)])
      .range([height - 50, 50]);

    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (_, i) => xScale(i.toString()) || 0)
      .attr('y', d => yScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', d => height - 50 - yScale(d))
      .attr('fill', mysticalTheme.secondary)
      .attr('stroke', mysticalTheme.text)
      .attr('stroke-width', 2);

    // Add value labels
    svg.selectAll('.value-label')
      .data(data)
      .enter()
      .append('text')
      .attr('x', (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', mysticalTheme.text)
      .style('font-size', '12px')
      .text(d => d);
  };

  // Additional visualization functions for other types
  const createStackVisualization = (container: HTMLElement) => {
    const width = 800;
    const height = 500;
    const svg = d3.select(container).append('svg').attr('width', width).attr('height', height).style('background', mysticalTheme.background);
    svg.append('text').attr('x', width / 2).attr('y', height / 2).attr('text-anchor', 'middle').attr('fill', mysticalTheme.primary).style('font-size', '20px').text('🥞 Stack - Russian Nesting Dolls');
  };

  const createQueueVisualization = (container: HTMLElement) => {
    const width = 800;
    const height = 500;
    const svg = d3.select(container).append('svg').attr('width', width).attr('height', height).style('background', mysticalTheme.background);
    svg.append('text').attr('x', width / 2).attr('y', height / 2).attr('text-anchor', 'middle').attr('fill', mysticalTheme.primary).style('font-size', '20px').text('🧍‍♀️ Queue - Mystical Checkout Line');
  };

  const createBinaryTreeVisualization = (container: HTMLElement) => {
    const width = 800;
    const height = 500;
    const svg = d3.select(container).append('svg').attr('width', width).attr('height', height).style('background', mysticalTheme.background);
    svg.append('text').attr('x', width / 2).attr('y', height / 2).attr('text-anchor', 'middle').attr('fill', mysticalTheme.primary).style('font-size', '20px').text('🌳 Binary Tree - Hierarchical Crystals');
  };

  const createArrayVisualization = (container: HTMLElement) => {
    const width = 800;
    const height = 500;
    const svg = d3.select(container).append('svg').attr('width', width).attr('height', height).style('background', mysticalTheme.background);
    svg.append('text').attr('x', width / 2).attr('y', height / 2).attr('text-anchor', 'middle').attr('fill', mysticalTheme.primary).style('font-size', '20px').text('📦 Array - Numbered Crystalline Lockers');
  };

  const createLinkedListVisualization = (container: HTMLElement) => {
    const width = 800;
    const height = 500;
    const svg = d3.select(container).append('svg').attr('width', width).attr('height', height).style('background', mysticalTheme.background);
    svg.append('text').attr('x', width / 2).attr('y', height / 2).attr('text-anchor', 'middle').attr('fill', mysticalTheme.primary).style('font-size', '20px').text('⛓️ Linked List - Treasure Hunt Chain');
  };

  const createHashTableVisualization = (container: HTMLElement) => {
    const width = 800;
    const height = 500;
    const svg = d3.select(container).append('svg').attr('width', width).attr('height', height).style('background', mysticalTheme.background);
    svg.append('text').attr('x', width / 2).attr('y', height / 2).attr('text-anchor', 'middle').attr('fill', mysticalTheme.primary).style('font-size', '20px').text('🎭 Hash Table - Mystical Coat Check');
  };

  const getMysticalVisualizationDescription = (type: string) => {
    const descriptions: Record<string, { title: string; description: string }> = {
      big_o: {
        title: "Big O Notation - Mystical Complexity Universe",
        description: "A mystical 2D graph showing how different algorithms scale with glowing complexity curves."
      },
      bfs_network: {
        title: "BFS Network - Crystalline Orbs & Pulsating Light",
        description: "Experience Breadth-First Search as crystalline orbs connected by pulsating light waves."
      },
      sorting_bars: {
        title: "Sorting - Mystical Bar Chart Race",
        description: "Visualize sorting algorithms as glowing crystalline bars that pulse with mystical energy."
      },
      stack: {
        title: "Stack - Russian Nesting Dolls",
        description: "Watch stack operations unfold like Russian nesting dolls with mystical glowing effects."
      },
      queue: {
        title: "Queue - Mystical Checkout Line",
        description: "Experience queue operations as a mystical checkout line with glowing customers."
      },
      binary_tree: {
        title: "Binary Tree - Hierarchical Crystals",
        description: "Explore binary tree structures as hierarchical crystals with pulsating connections."
      },
      array_boxes: {
        title: "Array - Numbered Crystalline Lockers",
        description: "See array operations as numbered crystalline lockers with glowing indices."
      },
      linked_list: {
        title: "Linked List - Treasure Hunt Chain",
        description: "Follow linked list traversal as a treasure hunt chain with mystical connections."
      },
      hash_table: {
        title: "Hash Table - Mystical Coat Check",
        description: "Watch hash table operations like a mystical coat check with glowing key-value pairs."
      }
    };
    
    return descriptions[type] || { title: "", description: "" };
  };

  return (
    <VStack spacing={4} w="full">
      <Text fontSize="lg" fontWeight="semibold" color="gray.700">
        Algorithm Visualization
      </Text>
      
      {/* Mystical Visualization Controls */}
      <Box w="full">
        <FormControl>
          <FormLabel fontSize="lg" fontWeight="bold" color="purple.500">
            ✨ Mystical Algorithm Visualizations ✨
          </FormLabel>
          <Text fontSize="sm" color="gray.500" mb={4}>
            Experience algorithmic concepts through mystical, glowing visualizations with crystalline orbs and pulsating light effects.
            Using data: [{dataset.join(', ')}]
          </Text>
          
          <HStack spacing={4} mb={4}>
            <Select
              value={mysticalVisualizationType}
              onChange={(e) => {
                setMysticalVisualizationType(e.target.value);
                if (e.target.value) {
                  setAlgorithm(e.target.value);
                }
              }}
              placeholder="Choose a mystical visualization..."
              size="sm"
              bg={useColorModeValue('white', 'gray.900')}
              w="350px"
            >
              <option value="big_o">🚀 Big O Notation - Complexity Universe</option>
              <option value="bfs_network">🌐 BFS Network - Crystalline Orbs</option>
              <option value="sorting_bars">📊 Sorting - Mystical Bar Chart Race</option>
              <option value="stack">🥞 Stack - Russian Nesting Dolls</option>
              <option value="queue">🧍‍♀️ Queue - Mystical Checkout Line</option>
              <option value="binary_tree">🌳 Binary Tree - Hierarchical Crystals</option>
              <option value="array_boxes">📦 Array - Numbered Crystalline Lockers</option>
              <option value="linked_list">⛓️ Linked List - Treasure Hunt Chain</option>
              <option value="hash_table">🎭 Hash Table - Mystical Coat Check</option>
            </Select>
            <Button
              onClick={generateMysticalVisualization}
              colorScheme="purple"
              size="sm"
              isLoading={isMysticalGenerating}
              loadingText="Generating..."
            >
              🎨 Generate Mystical Visualization
            </Button>
          </HStack>

          {/* Mystical Visualization Container */}
          <Box
            ref={mysticalVisualizationRef}
            w="full"
            minH="500px"
            bg="gray.900"
            borderRadius="lg"
            border="2px solid"
            borderColor="purple.500"
            position="relative"
            overflow="hidden"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {!mysticalVisualizationType && (
              <VStack spacing={4}>
                <Icon as={FaStar} boxSize={12} color="purple.300" />
                <Text color="gray.300" fontSize="lg" textAlign="center">
                  Select a mystical visualization above to experience algorithmic concepts<br />
                  through glowing, crystalline visualizations
                </Text>
              </VStack>
            )}
          </Box>

          {/* Visualization Descriptions */}
          {mysticalVisualizationType && (
            <Box mt={4} p={4} bg={useColorModeValue('purple.50', 'purple.900')} borderRadius="lg">
              <Text fontSize="sm" fontWeight="semibold" color="purple.700" mb={2}>
                {getMysticalVisualizationDescription(mysticalVisualizationType).title}
              </Text>
              <Text fontSize="sm" color="purple.600">
                {getMysticalVisualizationDescription(mysticalVisualizationType).description}
              </Text>
            </Box>
          )}
        </FormControl>
      </Box>
    </VStack>
  );
};

export default MysticalVisualizationPanel;
