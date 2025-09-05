// Shared D3.js visualization utilities for the Algorithmic Insights platform

import * as d3 from 'd3'
import type { VisualizationConfig } from '../types'

/**
 * Default visualization configuration
 */
export const defaultVisualizationConfig: VisualizationConfig = {
  width: 800,
  height: 400,
  margin: {
    top: 20,
    right: 20,
    bottom: 40,
    left: 40
  },
  colors: {
    default: '#3182ce',
    comparing: '#e53e3e',
    swapping: '#d69e2e',
    sorted: '#38a169',
    pivot: '#805ad5'
  },
  animation: {
    duration: 300,
    easing: 'ease-in-out'
  }
}

/**
 * Creates responsive SVG with proper viewBox
 */
export function createResponsiveSVG(
  container: HTMLElement,
  width: number,
  height: number
): d3.Selection<SVGSVGElement, unknown, null, undefined> {
  return d3.select(container)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('max-width', '100%')
    .style('height', 'auto')
}

/**
 * Creates scales for array visualization
 */
export function createArrayScales(
  data: number[],
  width: number,
  height: number,
  margin: VisualizationConfig['margin']
) {
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const xScale = d3.scaleBand()
    .domain(data.map((_, i) => i.toString()))
    .range([0, innerWidth])
    .padding(0.1)

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data) || 0])
    .range([innerHeight, 0])

  return { xScale, yScale, innerWidth, innerHeight }
}

/**
 * Creates color scale for different element states
 */
export function createColorScale(config: VisualizationConfig) {
  return {
    default: config.colors.default,
    comparing: config.colors.comparing,
    swapping: config.colors.swapping,
    sorted: config.colors.sorted,
    pivot: config.colors.pivot,
    getColor: (state: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot') => {
      return config.colors[state]
    }
  }
}

/**
 * Animates array elements with D3 transitions
 */
export function animateArrayElements(
  selection: d3.Selection<any, any, any, any>,
  data: number[],
  xScale: d3.ScaleBand<string>,
  yScale: d3.ScaleLinear<number, number>,
  config: VisualizationConfig,
  highlightedIndices: number[] = [],
  comparingIndices: number[] = [],
  swappingIndices: number[] = []
) {
  const colorScale = createColorScale(config)
  
  const rects = selection.selectAll('rect')
    .data(data)

  // Enter new elements
  rects.enter()
    .append('rect')
    .attr('x', (_, i) => xScale(i.toString()) || 0)
    .attr('y', yScale(0))
    .attr('width', xScale.bandwidth())
    .attr('height', 0)
    .attr('fill', colorScale.default)
    .transition()
    .duration(config.animation.duration)
    .attr('y', d => yScale(d))
    .attr('height', d => yScale(0) - yScale(d))

  // Update existing elements
  rects.transition()
    .duration(config.animation.duration)
    .attr('x', (_, i) => xScale(i.toString()) || 0)
    .attr('y', d => yScale(d))
    .attr('width', xScale.bandwidth())
    .attr('height', d => yScale(0) - yScale(d))
    .attr('fill', (_, i) => {
      if (swappingIndices.includes(i)) return colorScale.swapping
      if (comparingIndices.includes(i)) return colorScale.comparing
      if (highlightedIndices.includes(i)) return colorScale.sorted
      return colorScale.default
    })

  // Remove old elements
  rects.exit()
    .transition()
    .duration(config.animation.duration)
    .attr('height', 0)
    .attr('y', yScale(0))
    .remove()

  return rects
}

/**
 * Adds value labels to array elements
 */
export function addValueLabels(
  container: d3.Selection<any, any, any, any>,
  data: number[],
  xScale: d3.ScaleBand<string>,
  yScale: d3.ScaleLinear<number, number>,
  config: VisualizationConfig
) {
  const labels = container.selectAll('.value-label')
    .data(data)

  labels.enter()
    .append('text')
    .attr('class', 'value-label')
    .attr('x', (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d) - 5)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .attr('fill', '#2d3748')
    .text(d => d)
    .style('opacity', 0)
    .transition()
    .duration(config.animation.duration)
    .style('opacity', 1)

  labels.transition()
    .duration(config.animation.duration)
    .attr('x', (_, i) => (xScale(i.toString()) || 0) + xScale.bandwidth() / 2)
    .attr('y', d => yScale(d) - 5)
    .text(d => d)

  labels.exit()
    .transition()
    .duration(config.animation.duration)
    .style('opacity', 0)
    .remove()
}

/**
 * Creates axis for array visualization
 */
export function createArrayAxes(
  container: d3.Selection<any, any, any, any>,
  xScale: d3.ScaleBand<string>,
  yScale: d3.ScaleLinear<number, number>,
  innerHeight: number,
  config: VisualizationConfig
) {
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)

  // Add x-axis
  container.selectAll('.x-axis')
    .data([null])
    .join('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${innerHeight})`)
    .transition()
    .duration(config.animation.duration)
    .call(xAxis as any)

  // Add y-axis
  container.selectAll('.y-axis')
    .data([null])
    .join('g')
    .attr('class', 'y-axis')
    .transition()
    .duration(config.animation.duration)
    .call(yAxis as any)
}

/**
 * Creates tree layout for tree visualizations
 */
export function createTreeLayout(
  width: number,
  height: number,
  margin: VisualizationConfig['margin']
) {
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  return d3.tree<any>()
    .size([innerWidth, innerHeight])
    .separation((a, b) => (a.parent === b.parent ? 1 : 2))
}

/**
 * Creates force simulation for graph visualizations
 */
export function createForceSimulation(
  nodes: any[],
  links: any[],
  width: number,
  height: number
) {
  return d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(30))
}

/**
 * Highlights elements with smooth transitions
 */
export function highlightElements(
  selection: d3.Selection<any, any, any, any>,
  indices: number[],
  color: string,
  duration: number = 300
) {
  selection.selectAll('rect')
    .transition()
    .duration(duration)
    .attr('fill', (_, i) => indices.includes(i) ? color : '#3182ce')
    .attr('stroke', (_, i) => indices.includes(i) ? '#2d3748' : 'none')
    .attr('stroke-width', (_, i) => indices.includes(i) ? 2 : 0)
}

/**
 * Creates smooth swapping animation
 */
export function animateSwap(
  selection: d3.Selection<any, any, any, any>,
  index1: number,
  index2: number,
  xScale: d3.ScaleBand<string>,
  duration: number = 500
) {
  const rect1 = selection.select(`rect:nth-child(${index1 + 1})`)
  const rect2 = selection.select(`rect:nth-child(${index2 + 1})`)
  
  const x1 = xScale(index1.toString()) || 0
  const x2 = xScale(index2.toString()) || 0

  // Animate swap
  rect1.transition()
    .duration(duration / 2)
    .attr('transform', `translate(0, -20)`)
    .transition()
    .duration(duration / 2)
    .attr('x', x2)
    .attr('transform', 'translate(0, 0)')

  rect2.transition()
    .duration(duration / 2)
    .attr('transform', `translate(0, 20)`)
    .transition()
    .duration(duration / 2)
    .attr('x', x1)
    .attr('transform', 'translate(0, 0)')
}

/**
 * Creates legend for visualization
 */
export function createLegend(
  container: d3.Selection<any, any, any, any>,
  config: VisualizationConfig,
  x: number = 10,
  y: number = 10
) {
  const legendData = [
    { label: 'Default', color: config.colors.default },
    { label: 'Comparing', color: config.colors.comparing },
    { label: 'Swapping', color: config.colors.swapping },
    { label: 'Sorted', color: config.colors.sorted }
  ]

  const legend = container.selectAll('.legend-item')
    .data(legendData)
    .enter()
    .append('g')
    .attr('class', 'legend-item')
    .attr('transform', (_, i) => `translate(${x}, ${y + i * 25})`)

  legend.append('rect')
    .attr('width', 15)
    .attr('height', 15)
    .attr('fill', d => d.color)
    .attr('stroke', '#2d3748')
    .attr('stroke-width', 1)

  legend.append('text')
    .attr('x', 20)
    .attr('y', 12)
    .attr('font-size', '12px')
    .attr('fill', '#2d3748')
    .text(d => d.label)
}

/**
 * Performance optimized update function
 */
export function performantUpdate<T>(
  selection: d3.Selection<any, any, any, any>,
  data: T[],
  keyFunction: (d: T, i: number) => string,
  enterCallback: (enter: d3.Selection<any, T, any, any>) => void,
  updateCallback: (update: d3.Selection<any, T, any, any>) => void,
  exitCallback: (exit: d3.Selection<any, T, any, any>) => void
) {
  const bound = selection.selectAll('.data-element')
    .data(data, keyFunction as any)

  const enter = bound.enter().append('g').attr('class', 'data-element')
  const update = bound
  const exit = bound.exit()

  enterCallback(enter as any)
  updateCallback(update as any)
  exitCallback(exit as any)

  return { enter, update, exit }
}

/**
 * Cleanup function for D3 visualizations
 */
export function cleanup(container: HTMLElement) {
  d3.select(container).selectAll('*').remove()
}

/**
 * Responsive utility to get optimal dimensions
 */
export function getResponsiveDimensions(container: HTMLElement) {
  const rect = container.getBoundingClientRect()
  const width = Math.max(300, rect.width - 40) // Min width with padding
  const height = Math.max(200, Math.min(600, width * 0.6)) // Maintain aspect ratio
  
  return { width, height }
}

/**
 * Utility to convert D3 selection to array for easier manipulation
 */
export function selectionToArray<T>(selection: d3.Selection<any, T, any, any>): T[] {
  const array: T[] = []
  selection.each(function(d) {
    array.push(d)
  })
  return array
}
