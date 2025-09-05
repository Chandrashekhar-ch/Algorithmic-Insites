// Algorithm-specific visualization components

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { AlgorithmStep, AlgorithmState } from '../types'
import {
  createResponsiveSVG,
  createArrayScales,
  animateArrayElements,
  addValueLabels,
  createArrayAxes,
  defaultVisualizationConfig,
  highlightElements,
  animateSwap,
  cleanup,
  getResponsiveDimensions
} from './index'

interface SortingVisualizationProps {
  array: number[]
  currentStep?: AlgorithmStep | undefined
  isPlaying?: boolean
  config?: Partial<typeof defaultVisualizationConfig> | undefined
}

/**
 * Sorting algorithm visualization component
 */
export const SortingVisualization: React.FC<SortingVisualizationProps> = ({
  array,
  currentStep,
  config
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const visualConfig = { ...defaultVisualizationConfig, ...(config || {}) }

  useEffect(() => {
    if (!containerRef.current) return

    // Clean up previous visualization
    cleanup(containerRef.current)

    // Get responsive dimensions
    const { width, height } = getResponsiveDimensions(containerRef.current)
    
    // Create SVG
    const svg = createResponsiveSVG(containerRef.current, width, height)
    svgRef.current = svg.node()

    // Create scales
    const { xScale, yScale, innerHeight } = createArrayScales(
      array,
      width,
      height,
      visualConfig.margin
    )

    // Create main group
    const g = svg.append('g')
      .attr('transform', `translate(${visualConfig.margin.left}, ${visualConfig.margin.top})`)

    // Add axes
    createArrayAxes(g, xScale, yScale, innerHeight, visualConfig)

    // Initial render of array elements
    animateArrayElements(
      g,
      array,
      xScale,
      yScale,
      visualConfig,
      currentStep?.metadata?.sorted || [],
      currentStep?.metadata?.comparing || [],
      currentStep?.metadata?.swapping || []
    )

    // Add value labels
    addValueLabels(g, array, xScale, yScale, visualConfig)

  }, [array, currentStep, visualConfig])

  useEffect(() => {
    if (!svgRef.current || !currentStep) return

    const svg = d3.select(svgRef.current)
    const g = svg.select('g')

    // Highlight comparing elements
    if (currentStep.metadata?.comparing) {
      highlightElements(
        g,
        currentStep.metadata.comparing,
        visualConfig.colors.comparing,
        visualConfig.animation.duration
      )
    }

    // Animate swapping elements
    if (currentStep.metadata?.swapping && currentStep.metadata.swapping.length === 2) {
      const [index1, index2] = currentStep.metadata.swapping
      const { xScale } = createArrayScales(
        array,
        parseInt(svg.attr('width')) || 800,
        parseInt(svg.attr('height')) || 400,
        visualConfig.margin
      )
      
      animateSwap(g, index1, index2, xScale, (visualConfig.animation.duration || 300) * 2)
    }

  }, [currentStep, array, visualConfig])

  return (
    <div 
      ref={containerRef} 
      className="sorting-visualization"
      style={{ width: '100%', height: '100%', minHeight: '300px' }}
    />
  )
}

interface TreeVisualizationProps {
  nodes: Array<{ id: string; value: number; children?: string[] }>
  currentStep?: AlgorithmStep | undefined
  config?: Partial<typeof defaultVisualizationConfig> | undefined
}

/**
 * Tree algorithm visualization component
 */
export const TreeVisualization: React.FC<TreeVisualizationProps> = ({
  nodes,
  currentStep,
  config
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const visualConfig = { ...defaultVisualizationConfig, ...(config || {}) }

  useEffect(() => {
    if (!containerRef.current || !nodes.length) return

    cleanup(containerRef.current)

    const { width, height } = getResponsiveDimensions(containerRef.current)
    const svg = createResponsiveSVG(containerRef.current, width, height)

    // Convert flat nodes to hierarchy
    const root = d3.hierarchy({
      id: 'root',
      value: 0,
      children: nodes.filter(n => !nodes.some(parent => 
        parent.children?.includes(n.id)
      ))
    } as any)

    // Create tree layout
    const treeLayout = d3.tree()
      .size([width - visualConfig.margin.left - visualConfig.margin.right, 
             height - visualConfig.margin.top - visualConfig.margin.bottom])

    const treeData = treeLayout(root)

    const g = svg.append('g')
      .attr('transform', `translate(${visualConfig.margin.left}, ${visualConfig.margin.top})`)

    // Draw links
    g.selectAll('.link')
      .data(treeData.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', (d: any) => {
        const linkGenerator = d3.linkVertical()
          .x((d: any) => d.x)
          .y((d: any) => d.y)
        return linkGenerator(d)
      })
      .attr('fill', 'none')
      .attr('stroke', '#cbd5e0')
      .attr('stroke-width', 2)

    // Draw nodes
    const nodeGroups = g.selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)

    nodeGroups.append('circle')
      .attr('r', 20)
      .attr('fill', (d: any) => {
        if (currentStep?.metadata?.visiting?.includes(d.data.id)) {
          return visualConfig.colors.comparing
        }
        if (currentStep?.metadata?.visited?.includes(d.data.id)) {
          return visualConfig.colors.sorted
        }
        return visualConfig.colors.default
      })
      .attr('stroke', '#2d3748')
      .attr('stroke-width', 2)

    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', 'white')
      .text((d: any) => d.data.value || d.data.id)

  }, [nodes, currentStep, visualConfig])

  return (
    <div 
      ref={containerRef} 
      className="tree-visualization"
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
    />
  )
}

interface GraphVisualizationProps {
  nodes: Array<{ id: string; value?: number }>
  edges: Array<{ source: string; target: string; weight?: number }>
  currentStep?: AlgorithmStep | undefined
  config?: Partial<typeof defaultVisualizationConfig> | undefined
}

/**
 * Graph algorithm visualization component
 */
export const GraphVisualization: React.FC<GraphVisualizationProps> = ({
  nodes,
  edges,
  currentStep,
  config
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const visualConfig = { ...defaultVisualizationConfig, ...(config || {}) }

  useEffect(() => {
    if (!containerRef.current || !nodes.length) return

    cleanup(containerRef.current)

    const { width, height } = getResponsiveDimensions(containerRef.current)
    const svg = createResponsiveSVG(containerRef.current, width, height)

    // Create force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(edges).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(35))

    const g = svg.append('g')

    // Draw edges
    const links = g.selectAll('.link')
      .data(edges)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('stroke', '#cbd5e0')
      .attr('stroke-width', 2)

    // Draw nodes
    const nodeGroups = g.selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag<any, any>()
        .on('start', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d: any) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        })
      )

    nodeGroups.append('circle')
      .attr('r', 25)
      .attr('fill', (d: any) => {
        if (currentStep?.metadata?.visiting?.includes(d.id)) {
          return visualConfig.colors.comparing
        }
        if (currentStep?.metadata?.visited?.includes(d.id)) {
          return visualConfig.colors.sorted
        }
        if (currentStep?.metadata?.path?.includes(d.id)) {
          return visualConfig.colors.pivot
        }
        return visualConfig.colors.default
      })
      .attr('stroke', '#2d3748')
      .attr('stroke-width', 2)

    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.3em')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('fill', 'white')
      .text((d: any) => d.value || d.id)

    // Update positions on simulation tick
    simulation.on('tick', () => {
      links
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      nodeGroups
        .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)
    })

    return () => {
      simulation.stop()
    }

  }, [nodes, edges, currentStep, visualConfig])

  return (
    <div 
      ref={containerRef} 
      className="graph-visualization"
      style={{ width: '100%', height: '100%', minHeight: '400px' }}
    />
  )
}

/**
 * Generic algorithm visualization wrapper
 */
interface AlgorithmVisualizationProps {
  state: AlgorithmState
  type: 'sorting' | 'tree' | 'graph'
  config?: Partial<typeof defaultVisualizationConfig> | undefined
}

export const AlgorithmVisualization: React.FC<AlgorithmVisualizationProps> = ({
  state,
  type,
  config
}) => {
  const currentStep = state.steps[state.currentStep] || state.steps[state.currentStepIndex]

  switch (type) {
    case 'sorting':
      return (
        <SortingVisualization
          array={(state.data || state.dataset) as number[]}
          currentStep={currentStep}
          isPlaying={state.isPlaying}
          config={config}
        />
      )
    
    case 'tree':
      return (
        <TreeVisualization
          nodes={(state.data || state.dataset) as any[]}
          currentStep={currentStep}
          config={config}
        />
      )
    
    case 'graph':
      return (
        <GraphVisualization
          nodes={(state.data as any)?.nodes || []}
          edges={(state.data as any)?.edges || []}
          currentStep={currentStep}
          config={config}
        />
      )
    
    default:
      return <div>Unsupported visualization type: {type}</div>
  }
}

export default AlgorithmVisualization
