import { useRef, useEffect, type DependencyList } from 'react'
import * as d3 from 'd3'

/**
 * Custom hook for integrating D3.js with React
 * 
 * @param renderChartFn - Function that receives a D3 selection and renders the chart
 * @param dependencies - Array of dependencies that trigger re-rendering when changed
 * @returns SVG ref to be attached to an SVG element
 */
export const useD3 = (
  renderChartFn: (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) => void,
  dependencies: DependencyList
) => {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (ref.current) {
      // Clear previous content
      d3.select(ref.current).selectAll('*').remove()
      
      // Call the render function with the D3 selection
      renderChartFn(d3.select(ref.current))
    }
  }, dependencies)

  return ref
}
