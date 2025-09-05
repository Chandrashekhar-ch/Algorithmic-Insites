import React from 'react'
import { Box } from '@chakra-ui/react'
import * as d3 from 'd3'
import { useD3 } from '../../hooks/useD3'
import { useCurrentStep, useSpeed } from '../../store/useStore'
import { Graph, GraphNode, GraphEdge } from '../../algorithms/graphAlgorithms'

interface GraphVisualizerProps {
  width?: number
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  isComparison?: boolean
  graph: Graph
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  width = 800,
  height = 600,
  margin = { top: 50, right: 50, bottom: 50, left: 50 },
  isComparison = false,
  graph
}) => {
  const currentStep = useCurrentStep(isComparison)
  const speed = useSpeed(isComparison)

  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  const renderGraph = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    if (!graph || graph.nodes.size === 0) return

    // Create main chart group
    const chartGroup = svg.selectAll('.graph-group')
      .data([null])
      .join('g')
      .attr('class', 'graph-group')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Convert Map to Array for D3
    const nodes = Array.from(graph.nodes.values())
    const edges = graph.edges

    // Create force simulation for layout
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(edges)
        .id((d: any) => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(chartWidth / 2, chartHeight / 2))
      .force('collision', d3.forceCollide().radius(35))

    // Stop the simulation to prevent animation conflicts
    simulation.stop()
    
    // Run simulation for a few ticks to get good positions
    for (let i = 0; i < 300; ++i) simulation.tick()

    // Color functions
    const getNodeColor = (node: GraphNode): string => {
      if (node.isProcessing) return '#e53e3e' // Red for processing
      if (node.isVisited) return '#38a169' // Green for visited
      if (node.isDiscovered) return '#3182ce' // Blue for discovered
      return '#718096' // Gray for unvisited
    }

    const getEdgeColor = (edge: GraphEdge): string => {
      if (edge.isDiscovering) return '#e53e3e' // Red for currently discovering
      if (edge.isTraversed) return '#38a169' // Green for traversed
      return '#cbd5e0' // Light gray for untraversed
    }

    // Draw edges first (so they appear behind nodes)
    const linkSelection = chartGroup.selectAll('.link')
      .data(edges, (d: any) => `${d.source.id || d.source}-${d.target.id || d.target}`)

    linkSelection.join(
      enter => enter.append('line')
        .attr('class', 'link')
        .attr('stroke', d => getEdgeColor(d))
        .attr('stroke-width', d => d.isDiscovering ? 4 : d.isTraversed ? 3 : 2)
        .attr('stroke-opacity', 0.8)
        .attr('x1', (d: any) => {
          const sourceNode = typeof d.source === 'string' ? 
            nodes.find(n => n.id === d.source) : d.source
          return sourceNode?.x || 0
        })
        .attr('y1', (d: any) => {
          const sourceNode = typeof d.source === 'string' ? 
            nodes.find(n => n.id === d.source) : d.source
          return sourceNode?.y || 0
        })
        .attr('x2', (d: any) => {
          const targetNode = typeof d.target === 'string' ? 
            nodes.find(n => n.id === d.target) : d.target
          return targetNode?.x || 0
        })
        .attr('y2', (d: any) => {
          const targetNode = typeof d.target === 'string' ? 
            nodes.find(n => n.id === d.target) : d.target
          return targetNode?.y || 0
        }),
      update => update.transition()
        .duration(speed / 2)
        .attr('stroke', d => getEdgeColor(d))
        .attr('stroke-width', d => d.isDiscovering ? 4 : d.isTraversed ? 3 : 2)
        .attr('x1', (d: any) => {
          const sourceNode = typeof d.source === 'string' ? 
            nodes.find(n => n.id === d.source) : d.source
          return sourceNode?.x || 0
        })
        .attr('y1', (d: any) => {
          const sourceNode = typeof d.source === 'string' ? 
            nodes.find(n => n.id === d.source) : d.source
          return sourceNode?.y || 0
        })
        .attr('x2', (d: any) => {
          const targetNode = typeof d.target === 'string' ? 
            nodes.find(n => n.id === d.target) : d.target
          return targetNode?.x || 0
        })
        .attr('y2', (d: any) => {
          const targetNode = typeof d.target === 'string' ? 
            nodes.find(n => n.id === d.target) : d.target
          return targetNode?.y || 0
        }),
      exit => exit.transition()
        .duration(speed / 4)
        .style('opacity', 0)
        .remove()
    )

    // Draw edge weights if they exist
    const weightSelection = chartGroup.selectAll('.weight')
      .data(edges.filter(e => e.weight !== undefined), (d: any) => `weight-${d.source.id || d.source}-${d.target.id || d.target}`)

    weightSelection.join(
      enter => {
        const texts = enter.append('text')
          .attr('class', 'weight')
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .attr('text-anchor', 'middle')
          .attr('fill', '#2d3748')
          .attr('x', (d: any) => {
            const sourceNode = typeof d.source === 'string' ? 
              nodes.find(n => n.id === d.source) : d.source
            const targetNode = typeof d.target === 'string' ? 
              nodes.find(n => n.id === d.target) : d.target
            return ((sourceNode?.x || 0) + (targetNode?.x || 0)) / 2
          })
          .attr('y', (d: any) => {
            const sourceNode = typeof d.source === 'string' ? 
              nodes.find(n => n.id === d.source) : d.source
            const targetNode = typeof d.target === 'string' ? 
              nodes.find(n => n.id === d.target) : d.target
            return ((sourceNode?.y || 0) + (targetNode?.y || 0)) / 2 - 5
          })
          .text(d => d.weight?.toString() || '')
          .style('opacity', 0)
          
        texts.transition()
          .duration(speed / 2)
          .style('opacity', 1)
          
        return texts
      },
      update => update.transition()
        .duration(speed / 2)
        .attr('x', (d: any) => {
          const sourceNode = typeof d.source === 'string' ? 
            nodes.find(n => n.id === d.source) : d.source
          const targetNode = typeof d.target === 'string' ? 
            nodes.find(n => n.id === d.target) : d.target
          return ((sourceNode?.x || 0) + (targetNode?.x || 0)) / 2
        })
        .attr('y', (d: any) => {
          const sourceNode = typeof d.source === 'string' ? 
            nodes.find(n => n.id === d.source) : d.source
          const targetNode = typeof d.target === 'string' ? 
            nodes.find(n => n.id === d.target) : d.target
          return ((sourceNode?.y || 0) + (targetNode?.y || 0)) / 2 - 5
        })
        .text(d => d.weight?.toString() || ''),
      exit => exit.transition()
        .duration(speed / 4)
        .style('opacity', 0)
        .remove()
    )

    // Draw nodes
    const nodeSelection = chartGroup.selectAll('.node')
      .data(nodes, (d: any) => d.id)

    const nodeEnter = nodeSelection.enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x}, ${d.y})`)

    // Add circles for nodes
    nodeEnter.append('circle')
      .attr('r', 0)
      .attr('fill', d => getNodeColor(d))
      .attr('stroke', '#2d3748')
      .attr('stroke-width', 2)
      .transition()
      .duration(speed / 2)
      .attr('r', 25)

    // Add labels
    nodeEnter.append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', 'white')
      .style('opacity', 0)
      .text(d => d.label)
      .transition()
      .duration(speed / 2)
      .style('opacity', 1)

    // Add distance labels for Dijkstra
    nodeEnter.append('text')
      .attr('class', 'distance-label')
      .attr('dy', '3em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', '#2d3748')
      .style('opacity', 0)
      .text(d => d.distance !== undefined ? `d: ${d.distance === Infinity ? '∞' : d.distance}` : '')

    // Update existing nodes
    nodeSelection.transition()
      .duration(speed)
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .select('circle')
      .attr('fill', d => getNodeColor(d))

    // Update distance labels
    nodeSelection.select('.distance-label')
      .transition()
      .duration(speed / 2)
      .text(d => d.distance !== undefined ? `d: ${d.distance === Infinity ? '∞' : d.distance}` : '')
      .style('opacity', d => d.distance !== undefined ? 1 : 0)

    // Remove exiting nodes
    nodeSelection.exit()
      .transition()
      .duration(speed / 2)
      .style('opacity', 0)
      .remove()

    // Add title
    svg.selectAll('.graph-title')
      .data([null])
      .join('text')
      .attr('class', 'graph-title')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .attr('fill', '#2d3748')
      .text('Graph Algorithm Visualization')
  }

  const svgRef = useD3(renderGraph, [graph, currentStep, speed])

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
      <Box mt={4} display="flex" justifyContent="center" gap={6} fontSize="sm" flexWrap="wrap">
        <Box display="flex" alignItems="center" gap={2}>
          <Box w={4} h={4} bg="#e53e3e" borderRadius="full" />
          <span>Processing/Discovering</span>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Box w={4} h={4} bg="#38a169" borderRadius="full" />
          <span>Visited/Traversed</span>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Box w={4} h={4} bg="#3182ce" borderRadius="full" />
          <span>Discovered</span>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Box w={4} h={4} bg="#718096" borderRadius="full" />
          <span>Unvisited</span>
        </Box>
      </Box>
    </Box>
  )
}

export default GraphVisualizer
