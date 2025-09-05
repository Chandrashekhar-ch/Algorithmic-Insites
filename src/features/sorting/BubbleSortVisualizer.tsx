import React from 'react'
import { Box } from '@chakra-ui/react'
import * as d3 from 'd3'
import { useD3 } from '../../hooks/useD3'
import { useCurrentStep, useSpeed, useDataset } from '../../store/useStore'

interface BubbleSortVisualizerProps {
  width?: number
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  isComparison?: boolean
}

const BubbleSortVisualizer: React.FC<BubbleSortVisualizerProps> = ({
  width = 800,
  height = 400,
  margin = { top: 20, right: 20, bottom: 30, left: 20 },
  isComparison = false
}) => {
  const currentStep = useCurrentStep(isComparison)
  const speed = useSpeed(isComparison)
  const dataset = useDataset(isComparison)

  // Calculate chart dimensions
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  const renderChartFn = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    // Get current data from algorithm step or fallback to original dataset
    const currentData = currentStep?.data || dataset
    
    if (currentData.length === 0) return

    // Create scales
    const xScale = d3.scaleBand()
      .domain(currentData.map((_, i) => i.toString()))
      .range([0, chartWidth])
      .padding(0.1)

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(currentData) || 100])
      .range([chartHeight, 0])

    // Create color scale for different states
    const getBarColor = (index: number): string => {
      const comparedIndices = currentStep?.comparingElements || []
      const swappedIndices = currentStep?.swappingElements || []
      const highlightedIndices = currentStep?.highlightedElements || []

      if (swappedIndices.includes(index)) {
        return '#e53e3e' // Red for swapped elements
      }
      if (comparedIndices.includes(index)) {
        return '#3182ce' // Blue for compared elements
      }
      if (highlightedIndices.includes(index)) {
        return '#38a169' // Green for highlighted elements
      }
      return '#718096' // Gray for normal elements
    }

    // Create main chart group
    const chartGroup = svg.selectAll('.chart-group')
      .data([null])
      .join('g')
      .attr('class', 'chart-group')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Select all bars and bind data
    const bars = chartGroup.selectAll('.bar')
      .data(currentData, (d, i) => `${d}-${i}`)

    // Handle enter-update-exit cycle
    bars.join(
      // ENTER: Create new bars
      (enter) => 
        enter.append('rect')
          .attr('class', 'bar')
          .attr('x', (_, i) => xScale(i.toString()) || 0)
          .attr('y', chartHeight) // Start from bottom
          .attr('width', xScale.bandwidth())
          .attr('height', 0) // Start with 0 height
          .attr('fill', (_, i) => getBarColor(i))
          .attr('stroke', '#2d3748')
          .attr('stroke-width', 1)
          .attr('rx', 4) // Rounded corners
          .attr('ry', 4)
          .call((enter) => 
            enter.transition()
              .duration(speed / 2)
              .attr('y', (d) => yScale(d))
              .attr('height', (d) => chartHeight - yScale(d))
          ),

      // UPDATE: Animate existing bars
      (update) => 
        update.call((update) => 
          update.transition()
            .duration(speed)
            .ease(d3.easeQuadInOut)
            .attr('x', (_, i) => xScale(i.toString()) || 0)
            .attr('y', (d) => yScale(d))
            .attr('width', xScale.bandwidth())
            .attr('height', (d) => chartHeight - yScale(d))
            .attr('fill', (_, i) => getBarColor(i))
        ),

      // EXIT: Remove bars that are no longer needed
      (exit) => 
        exit.call((exit) => 
          exit.transition()
            .duration(speed / 2)
            .attr('height', 0)
            .attr('y', chartHeight)
            .remove()
        )
    )

    // Add value labels on top of bars
    const labels = chartGroup.selectAll('.label')
      .data(currentData, (d, i) => `label-${d}-${i}`)

    labels.join(
      // ENTER: Create new labels
      (enter) => 
        enter.append('text')
          .attr('class', 'label')
          .attr('x', (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
          .attr('y', chartHeight)
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .attr('fill', '#2d3748')
          .text((d) => d)
          .call((enter) => 
            enter.transition()
              .duration(speed / 2)
              .attr('y', (d) => yScale(d) - 5)
          ),

      // UPDATE: Animate existing labels
      (update) => 
        update.call((update) => 
          update.transition()
            .duration(speed)
            .ease(d3.easeQuadInOut)
            .attr('x', (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
            .attr('y', (d) => yScale(d) - 5)
            .text((d) => d)
        ),

      // EXIT: Remove labels
      (exit) => 
        exit.call((exit) => 
          exit.transition()
            .duration(speed / 2)
            .attr('y', chartHeight)
            .remove()
        )
    )

    // Add x-axis
    const xAxis = d3.axisBottom(xScale)
      .tickFormat((d) => `[${d}]`)

    chartGroup.selectAll('.x-axis')
      .data([null])
      .join('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${chartHeight})`)
      .call(xAxis)
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#4a5568')

    // Add y-axis
    const yAxis = d3.axisLeft(yScale)
      .ticks(5)

    chartGroup.selectAll('.y-axis')
      .data([null])
      .join('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .style('font-size', '10px')
      .style('fill', '#4a5568')

    // Add chart title
    svg.selectAll('.chart-title')
      .data([null])
      .join('text')
      .attr('class', 'chart-title')
      .attr('x', width / 2)
      .attr('y', margin.top / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', '#2d3748')
      .text(isComparison ? 'Comparison Algorithm' : 'Main Algorithm')
  }

  const svgRef = useD3(renderChartFn, [currentStep, speed, dataset])

  return (
    <Box
      bg="white"
      borderRadius="lg"
      shadow="md"
      border="1px"
      borderColor="gray.200"
      p={4}
      w="full"
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          backgroundColor: '#fafafa'
        }}
      />
      
      {/* Legend */}
      <Box mt={4} display="flex" justifyContent="center" gap={6} fontSize="sm">
        <Box display="flex" alignItems="center" gap={2}>
          <Box w={4} h={4} bg="#e53e3e" borderRadius="sm" />
          <span>Swapped</span>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Box w={4} h={4} bg="#3182ce" borderRadius="sm" />
          <span>Comparing</span>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Box w={4} h={4} bg="#38a169" borderRadius="sm" />
          <span>Highlighted</span>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Box w={4} h={4} bg="#718096" borderRadius="sm" />
          <span>Normal</span>
        </Box>
      </Box>
    </Box>
  )
}

export default BubbleSortVisualizer
