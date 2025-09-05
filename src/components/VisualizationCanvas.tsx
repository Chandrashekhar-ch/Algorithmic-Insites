import React, { useRef, useEffect, useState } from 'react'
import { Box, useColorModeValue } from '@chakra-ui/react'
import * as d3 from 'd3'
import { useD3 } from '../hooks/useD3'
import type { AlgorithmStep } from '../utils/codeExecutor'

interface VisualizationCanvasProps {
  data: number[]
  currentStep?: AlgorithmStep
  width?: number
  height?: number
  animationSpeed?: number
}

const VisualizationCanvas: React.FC<VisualizationCanvasProps> = ({
  data,
  currentStep,
  width = 800,
  height = 400,
  animationSpeed = 500
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width, height })
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.700', 'gray.200')

  // Responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        setDimensions({
          width: Math.min(containerWidth, width),
          height: Math.max(300, Math.min(containerWidth * 0.5, height))
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [width, height])

  const svgRef = useD3(
    (svg) => {
      if (!data || data.length === 0) return

      // Clear previous content
      svg.selectAll('*').remove()

      // Set up dimensions and margins
      const margin = { top: 20, right: 20, bottom: 40, left: 40 }
      const innerWidth = dimensions.width - margin.left - margin.right
      const innerHeight = dimensions.height - margin.top - margin.bottom

      // Create scales
      const xScale = d3.scaleBand()
        .domain(data.map((_, i) => i.toString()))
        .range([0, innerWidth])
        .padding(0.1)

      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data) || 0])
        .range([innerHeight, 0])

      // Create color scale
      const getBarColor = (index: number) => {
        if (!currentStep) return '#3182ce' // Default blue
        
        switch (currentStep.type) {
          case 'compare':
            return currentStep.indices.includes(index) ? '#ecc94b' : '#3182ce' // Yellow for comparing
          case 'swap':
            return currentStep.indices.includes(index) ? '#f56565' : '#3182ce' // Red for swapping
          case 'highlight':
            return currentStep.indices.includes(index) ? '#ed8936' : '#3182ce' // Orange for highlight
          case 'move':
            return currentStep.indices.includes(index) ? '#9f7aea' : '#3182ce' // Purple for move
          case 'insert':
            return currentStep.indices.includes(index) ? '#38a169' : '#3182ce' // Green for insert
          case 'complete':
            return '#38a169' // All green when complete
          default:
            return '#3182ce'
        }
      }

      // Create main group
      const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

      // Create axes
      const xAxis = d3.axisBottom(xScale)
      const yAxis = d3.axisLeft(yScale)

      g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(xAxis)
        .selectAll('text')
        .style('fill', textColor)

      g.append('g')
        .attr('class', 'y-axis')
        .call(yAxis)
        .selectAll('text')
        .style('fill', textColor)

      // Create bars with data join pattern
      g.selectAll('.bar')
        .data(currentStep?.array || data)
        .join(
          enter => enter.append('rect')
            .attr('class', 'bar')
            .attr('x', (_, i) => xScale(i.toString()) || 0)
            .attr('y', yScale(0))
            .attr('width', xScale.bandwidth())
            .attr('height', 0)
            .attr('fill', (_, i) => getBarColor(i))
            .attr('stroke', '#2d3748')
            .attr('stroke-width', 1)
            .attr('rx', 2)
            .call(enter => enter.transition()
              .duration(animationSpeed)
              .attr('y', d => yScale(d))
              .attr('height', d => innerHeight - yScale(d))
            ),
          update => update
            .call(update => update.transition()
              .duration(animationSpeed)
              .attr('x', (_, i) => xScale(i.toString()) || 0)
              .attr('y', d => yScale(d))
              .attr('width', xScale.bandwidth())
              .attr('height', d => innerHeight - yScale(d))
              .attr('fill', (_, i) => getBarColor(i))
            ),
          exit => exit
            .call(exit => exit.transition()
              .duration(animationSpeed / 2)
              .attr('height', 0)
              .attr('y', yScale(0))
              .remove()
            )
        )

      // Add value labels on bars
      g.selectAll('.label')
        .data(currentStep?.array || data)
        .join(
          enter => enter.append('text')
            .attr('class', 'label')
            .attr('x', (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d) - 5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .attr('fill', textColor)
            .text(d => d)
            .style('opacity', 0)
            .call(enter => enter.transition()
              .duration(animationSpeed)
              .style('opacity', 1)
            ),
          update => update
            .call(update => update.transition()
              .duration(animationSpeed)
              .attr('x', (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
              .attr('y', d => yScale(d) - 5)
              .text(d => d)
            ),
          exit => exit
            .call(exit => exit.transition()
              .duration(animationSpeed / 2)
              .style('opacity', 0)
              .remove()
            )
        )

      // Add special animations for swaps
      if (currentStep?.type === 'swap' && currentStep.indices.length >= 2) {
        const [index1, index2] = currentStep.indices
        if (index1 !== undefined && index2 !== undefined) {
          const bar1 = g.select(`.bar:nth-child(${index1 + 1})`)
          const bar2 = g.select(`.bar:nth-child(${index2 + 1})`)
          
          // Animate the swap with a slight vertical movement
          bar1.transition()
            .duration(animationSpeed / 2)
            .attr('transform', 'translate(0, -10)')
            .transition()
            .duration(animationSpeed / 2)
            .attr('transform', 'translate(0, 0)')
            .attr('x', xScale(index2.toString()) || 0)
          
          bar2.transition()
            .duration(animationSpeed / 2)
            .attr('transform', 'translate(0, 10)')
            .transition()
            .duration(animationSpeed / 2)
            .attr('transform', 'translate(0, 0)')
            .attr('x', xScale(index1.toString()) || 0)
        }
      }

      // Add pulsing animation for compared elements
      if (currentStep?.type === 'compare') {
        currentStep.indices.forEach(index => {
          g.select(`.bar:nth-child(${index + 1})`)
            .transition()
            .duration(animationSpeed / 4)
            .attr('stroke-width', 3)
            .transition()
            .duration(animationSpeed / 4)
            .attr('stroke-width', 1)
            .transition()
            .duration(animationSpeed / 4)
            .attr('stroke-width', 3)
            .transition()
            .duration(animationSpeed / 4)
            .attr('stroke-width', 1)
        })
      }

      // Add progress indicator
      const progressWidth = innerWidth * 0.8
      const progressHeight = 4
      const progressY = innerHeight + 25

      g.append('rect')
        .attr('x', (innerWidth - progressWidth) / 2)
        .attr('y', progressY)
        .attr('width', progressWidth)
        .attr('height', progressHeight)
        .attr('fill', '#e2e8f0')
        .attr('rx', 2)

      if (currentStep?.type === 'complete') {
        g.append('rect')
          .attr('x', (innerWidth - progressWidth) / 2)
          .attr('y', progressY)
          .attr('width', 0)
          .attr('height', progressHeight)
          .attr('fill', '#38a169')
          .attr('rx', 2)
          .transition()
          .duration(animationSpeed)
          .attr('width', progressWidth)
      }

      // Add title
      svg.append('text')
        .attr('x', dimensions.width / 2)
        .attr('y', 15)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', textColor)
        .text(currentStep?.description || 'Algorithm Visualization')

    },
    [data, currentStep, dimensions, animationSpeed, textColor]
  )

  return (
    <Box
      ref={containerRef}
      w="100%"
      h={`${dimensions.height}px`}
      bg={bgColor}
      borderRadius="lg"
      border="1px"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
      p={4}
      overflow="hidden"
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ width: '100%', height: '100%' }}
      />
    </Box>
  )
}

export default VisualizationCanvas
