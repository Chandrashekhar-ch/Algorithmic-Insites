import React from 'react'
import { Box } from '@chakra-ui/react'
import * as d3 from 'd3'
import { useD3 } from '../../hooks/useD3'
import { useCurrentStep, useSpeed, useDataset } from '../../store/useStore'

export interface TreeNode {
  id: string
  value: number
  x?: number
  y?: number
  children?: TreeNode[]
  parent?: TreeNode
  depth?: number
  isHighlighted?: boolean
  isComparing?: boolean
  isSwapping?: boolean
}

interface BinaryTreeVisualizerProps {
  width?: number
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  isComparison?: boolean
  treeData: TreeNode
}

const BinaryTreeVisualizer: React.FC<BinaryTreeVisualizerProps> = ({
  width = 800,
  height = 500,
  margin = { top: 50, right: 50, bottom: 50, left: 50 },
  isComparison = false,
  treeData
}) => {
  const currentStep = useCurrentStep(isComparison)
  const speed = useSpeed(isComparison)

  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  const renderTree = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => {
    if (!treeData) return

    // Create main chart group
    const chartGroup = svg.selectAll('.tree-group')
      .data([null])
      .join('g')
      .attr('class', 'tree-group')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Create tree layout
    const treeLayout = d3.tree<TreeNode>()
      .size([chartWidth, chartHeight])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2))

    // Create hierarchy from tree data
    const root = d3.hierarchy(treeData)
    const treeNodes = treeLayout(root)

    // Get nodes and links
    const nodes = treeNodes.descendants()
    const links = treeNodes.links()

    // Color function based on node state
    const getNodeColor = (node: d3.HierarchyPointNode<TreeNode>): string => {
      const nodeData = node.data
      if (nodeData.isSwapping) return '#e53e3e' // Red for swapping
      if (nodeData.isComparing) return '#3182ce' // Blue for comparing
      if (nodeData.isHighlighted) return '#38a169' // Green for highlighted
      return '#718096' // Gray for normal
    }

    // Draw links
    const linkSelection = chartGroup.selectAll('.link')
      .data(links, (d: any) => `${d.source.data.id}-${d.target.data.id}`)

    linkSelection.join(
      enter => enter.append('path')
        .attr('class', 'link')
        .attr('fill', 'none')
        .attr('stroke', '#cbd5e0')
        .attr('stroke-width', 2)
        .attr('d', d3.linkVertical<any, d3.HierarchyPointNode<TreeNode>>()
          .x(d => d.x)
          .y(d => d.y)
        ),
      update => update.transition()
        .duration(speed)
        .attr('d', d3.linkVertical<any, d3.HierarchyPointNode<TreeNode>>()
          .x(d => d.x)
          .y(d => d.y)
        ),
      exit => exit.transition()
        .duration(speed / 2)
        .style('opacity', 0)
        .remove()
    )

    // Draw nodes
    const nodeSelection = chartGroup.selectAll('.node')
      .data(nodes, (d: any) => d.data.id)

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

    // Add text labels
    nodeEnter.append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', 'white')
      .style('opacity', 0)
      .text(d => d.data.value)
      .transition()
      .duration(speed / 2)
      .style('opacity', 1)

    // Update existing nodes
    nodeSelection.transition()
      .duration(speed)
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .select('circle')
      .attr('fill', d => getNodeColor(d))

    // Remove exiting nodes
    nodeSelection.exit()
      .transition()
      .duration(speed / 2)
      .style('opacity', 0)
      .remove()

    // Add tree title
    svg.selectAll('.tree-title')
      .data([null])
      .join('text')
      .attr('class', 'tree-title')
      .attr('x', width / 2)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .attr('fill', '#2d3748')
      .text('Binary Search Tree Visualization')
  }

  const svgRef = useD3(renderTree, [treeData, currentStep, speed])

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
          <Box w={4} h={4} bg="#e53e3e" borderRadius="full" />
          <span>Current Operation</span>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Box w={4} h={4} bg="#3182ce" borderRadius="full" />
          <span>Comparing</span>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Box w={4} h={4} bg="#38a169" borderRadius="full" />
          <span>Found/Inserted</span>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Box w={4} h={4} bg="#718096" borderRadius="full" />
          <span>Normal</span>
        </Box>
      </Box>
    </Box>
  )
}

export default BinaryTreeVisualizer
