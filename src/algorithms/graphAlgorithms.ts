export interface GraphNode {
  id: string
  label: string
  x?: number
  y?: number
  isVisited?: boolean
  isDiscovered?: boolean
  isProcessing?: boolean
  distance?: number | undefined
  previous?: string | null | undefined
}

export interface GraphEdge {
  source: string
  target: string
  weight?: number
  isTraversed?: boolean
  isDiscovering?: boolean
}

export interface Graph {
  nodes: Map<string, GraphNode>
  adjacencyList: Map<string, Set<string>>
  edges: GraphEdge[]
  isDirected: boolean
}

export interface GraphVisualizationStep {
  type: 'discover' | 'visit' | 'process' | 'relax' | 'finish'
  currentNode?: string
  discoveredNode?: string
  edge?: GraphEdge | undefined
  description: string
  queue?: string[]
  stack?: string[]
  distances?: Map<string, number>
  previous?: Map<string, string | null>
  statistics: {
    nodesVisited: number
    edgesTraversed: number
    operationsCount: number
  }
}

export class GraphAlgorithms {
  private graph: Graph

  constructor(graph: Graph) {
    this.graph = graph
  }

  private clearHighlights(): void {
    for (const node of this.graph.nodes.values()) {
      node.isVisited = false
      node.isDiscovered = false
      node.isProcessing = false
      node.distance = undefined
      node.previous = undefined
    }
    for (const edge of this.graph.edges) {
      edge.isTraversed = false
      edge.isDiscovering = false
    }
  }

  *breadthFirstSearch(startNodeId: string): Generator<GraphVisualizationStep> {
    this.clearHighlights()
    
    const startNode = this.graph.nodes.get(startNodeId)
    if (!startNode) {
      yield {
        type: 'finish',
        description: `Start node ${startNodeId} not found`,
        queue: [],
        statistics: { nodesVisited: 0, edgesTraversed: 0, operationsCount: 0 }
      }
      return
    }

    const queue: string[] = [startNodeId]
    const visited = new Set<string>()
    const discovered = new Set<string>([startNodeId])
    let nodesVisited = 0
    let edgesTraversed = 0
    let operationsCount = 0

    startNode.isDiscovered = true
    yield {
      type: 'discover',
      currentNode: startNodeId,
      discoveredNode: startNodeId,
      description: `Starting BFS from node ${startNode.label}`,
      queue: [...queue],
      statistics: { nodesVisited, edgesTraversed, operationsCount: ++operationsCount }
    }

    while (queue.length > 0) {
      const currentNodeId = queue.shift()!
      const currentNode = this.graph.nodes.get(currentNodeId)!
      
      currentNode.isProcessing = true
      visited.add(currentNodeId)
      nodesVisited++

      yield {
        type: 'process',
        currentNode: currentNodeId,
        description: `Processing node ${currentNode.label}`,
        queue: [...queue],
        statistics: { nodesVisited, edgesTraversed, operationsCount: ++operationsCount }
      }

      // Get neighbors
      const neighbors = this.graph.adjacencyList.get(currentNodeId) || new Set()
      
      for (const neighborId of neighbors) {
        const neighbor = this.graph.nodes.get(neighborId)!
        edgesTraversed++

        // Find and highlight the edge
        const edge = this.graph.edges.find(e =>
          (e.source === currentNodeId && e.target === neighborId) ||
          (!this.graph.isDirected && e.source === neighborId && e.target === currentNodeId)
        )
        
        if (edge) {
          edge.isDiscovering = true
        }

        if (!discovered.has(neighborId)) {
          discovered.add(neighborId)
          queue.push(neighborId)
          neighbor.isDiscovered = true

          yield {
            type: 'discover',
            currentNode: currentNodeId,
            discoveredNode: neighborId,
            edge,
            description: `Discovered node ${neighbor.label} from ${currentNode.label}`,
            queue: [...queue],
            statistics: { nodesVisited, edgesTraversed, operationsCount: ++operationsCount }
          }
        }

        if (edge) {
          edge.isDiscovering = false
          edge.isTraversed = true
        }
      }

      currentNode.isProcessing = false
      currentNode.isVisited = true

      yield {
        type: 'visit',
        currentNode: currentNodeId,
        description: `Finished processing node ${currentNode.label}`,
        queue: [...queue],
        statistics: { nodesVisited, edgesTraversed, operationsCount: ++operationsCount }
      }
    }

    yield {
      type: 'finish',
      description: 'BFS traversal completed',
      queue: [],
      statistics: { nodesVisited, edgesTraversed, operationsCount }
    }
  }

  *depthFirstSearch(startNodeId: string): Generator<GraphVisualizationStep> {
    this.clearHighlights()
    
    const startNode = this.graph.nodes.get(startNodeId)
    if (!startNode) {
      yield {
        type: 'finish',
        description: `Start node ${startNodeId} not found`,
        stack: [],
        statistics: { nodesVisited: 0, edgesTraversed: 0, operationsCount: 0 }
      }
      return
    }

    const stack: string[] = [startNodeId]
    const visited = new Set<string>()
    let nodesVisited = 0
    let edgesTraversed = 0
    let operationsCount = 0

    yield {
      type: 'discover',
      currentNode: startNodeId,
      discoveredNode: startNodeId,
      description: `Starting DFS from node ${startNode.label}`,
      stack: [...stack],
      statistics: { nodesVisited, edgesTraversed, operationsCount: ++operationsCount }
    }

    while (stack.length > 0) {
      const currentNodeId = stack.pop()!
      
      if (visited.has(currentNodeId)) {
        continue
      }

      const currentNode = this.graph.nodes.get(currentNodeId)!
      visited.add(currentNodeId)
      nodesVisited++
      
      currentNode.isProcessing = true
      currentNode.isVisited = true

      yield {
        type: 'visit',
        currentNode: currentNodeId,
        description: `Visiting node ${currentNode.label}`,
        stack: [...stack],
        statistics: { nodesVisited, edgesTraversed, operationsCount: ++operationsCount }
      }

      // Get neighbors (reverse order for consistent traversal)
      const neighbors = Array.from(this.graph.adjacencyList.get(currentNodeId) || new Set()).reverse()
      
      for (const neighborId of neighbors) {
        const neighborIdStr = neighborId as string
        edgesTraversed++
        
        // Find and highlight the edge
        const edge = this.graph.edges.find(e =>
          (e.source === currentNodeId && e.target === neighborIdStr) ||
          (!this.graph.isDirected && e.source === neighborIdStr && e.target === currentNodeId)
        )

        if (edge) {
          edge.isDiscovering = true
        }

        if (!visited.has(neighborIdStr)) {
          const neighbor = this.graph.nodes.get(neighborIdStr)!
          stack.push(neighborIdStr)
          neighbor.isDiscovered = true

          yield {
            type: 'discover',
            currentNode: currentNodeId,
            discoveredNode: neighborIdStr,
            edge,
            description: `Discovered node ${neighbor.label} from ${currentNode.label}`,
            stack: [...stack],
            statistics: { nodesVisited, edgesTraversed, operationsCount: ++operationsCount }
          }
        }

        if (edge) {
          edge.isDiscovering = false
          edge.isTraversed = true
        }
      }

      currentNode.isProcessing = false
    }

    yield {
      type: 'finish',
      description: 'DFS traversal completed',
      stack: [],
      statistics: { nodesVisited, edgesTraversed, operationsCount }
    }
  }

  *dijkstra(startNodeId: string): Generator<GraphVisualizationStep> {
    this.clearHighlights()
    
    const startNode = this.graph.nodes.get(startNodeId)
    if (!startNode) {
      yield {
        type: 'finish',
        description: `Start node ${startNodeId} not found`,
        distances: new Map(),
        previous: new Map(),
        statistics: { nodesVisited: 0, edgesTraversed: 0, operationsCount: 0 }
      }
      return
    }

    const distances = new Map<string, number>()
    const previous = new Map<string, string | null>()
    const unvisited = new Set<string>()
    let nodesVisited = 0
    let edgesTraversed = 0
    let operationsCount = 0

    // Initialize distances
    for (const nodeId of this.graph.nodes.keys()) {
      distances.set(nodeId, nodeId === startNodeId ? 0 : Infinity)
      previous.set(nodeId, null)
      unvisited.add(nodeId)
      const node = this.graph.nodes.get(nodeId)!
      node.distance = distances.get(nodeId)
    }

    yield {
      type: 'discover',
      currentNode: startNodeId,
      description: `Starting Dijkstra's algorithm from node ${startNode.label}`,
      distances: new Map(distances),
      previous: new Map(previous),
      statistics: { nodesVisited, edgesTraversed, operationsCount: ++operationsCount }
    }

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let currentNodeId: string | null = null
      let minDistance = Infinity

      for (const nodeId of unvisited) {
        const distance = distances.get(nodeId)!
        if (distance < minDistance) {
          minDistance = distance
          currentNodeId = nodeId
        }
      }

      if (currentNodeId === null || minDistance === Infinity) {
        break // No more reachable nodes
      }

      unvisited.delete(currentNodeId)
      const currentNode = this.graph.nodes.get(currentNodeId)!
      currentNode.isProcessing = true
      nodesVisited++

      yield {
        type: 'process',
        currentNode: currentNodeId,
        description: `Processing node ${currentNode.label} (distance: ${minDistance})`,
        distances: new Map(distances),
        previous: new Map(previous),
        statistics: { nodesVisited, edgesTraversed, operationsCount: ++operationsCount }
      }

      // Check neighbors
      const neighbors = this.graph.adjacencyList.get(currentNodeId) || new Set()
      
      for (const neighborId of neighbors) {
        if (!unvisited.has(neighborId)) continue

        edgesTraversed++
        const edge = this.graph.edges.find(e =>
          (e.source === currentNodeId && e.target === neighborId) ||
          (!this.graph.isDirected && e.source === neighborId && e.target === currentNodeId)
        )
        
        const weight = edge?.weight || 1
        const newDistance = distances.get(currentNodeId)! + weight
        const currentDistance = distances.get(neighborId)!

        if (edge) {
          edge.isDiscovering = true
        }

        if (newDistance < currentDistance) {
          distances.set(neighborId, newDistance)
          previous.set(neighborId, currentNodeId)
          const neighbor = this.graph.nodes.get(neighborId)!
          neighbor.distance = newDistance
          neighbor.previous = currentNodeId

          yield {
            type: 'relax',
            currentNode: currentNodeId,
            discoveredNode: neighborId,
            edge,
            description: `Relaxed edge to ${neighbor.label}: distance updated to ${newDistance}`,
            distances: new Map(distances),
            previous: new Map(previous),
            statistics: { nodesVisited, edgesTraversed, operationsCount: ++operationsCount }
          }
        }

        if (edge) {
          edge.isDiscovering = false
          edge.isTraversed = true
        }
      }

      currentNode.isProcessing = false
      currentNode.isVisited = true
    }

    yield {
      type: 'finish',
      description: 'Dijkstra\'s algorithm completed',
      distances: new Map(distances),
      previous: new Map(previous),
      statistics: { nodesVisited, edgesTraversed, operationsCount }
    }
  }

  // Helper method to create a sample graph
  static createSampleGraph(): Graph {
    const nodes = new Map<string, GraphNode>([
      ['A', { id: 'A', label: 'A' }],
      ['B', { id: 'B', label: 'B' }],
      ['C', { id: 'C', label: 'C' }],
      ['D', { id: 'D', label: 'D' }],
      ['E', { id: 'E', label: 'E' }],
      ['F', { id: 'F', label: 'F' }],
    ])

    const adjacencyList = new Map<string, Set<string>>([
      ['A', new Set(['B', 'C'])],
      ['B', new Set(['A', 'D', 'E'])],
      ['C', new Set(['A', 'F'])],
      ['D', new Set(['B'])],
      ['E', new Set(['B', 'F'])],
      ['F', new Set(['C', 'E'])],
    ])

    const edges: GraphEdge[] = [
      { source: 'A', target: 'B', weight: 4 },
      { source: 'A', target: 'C', weight: 2 },
      { source: 'B', target: 'D', weight: 5 },
      { source: 'B', target: 'E', weight: 1 },
      { source: 'C', target: 'F', weight: 3 },
      { source: 'E', target: 'F', weight: 2 },
    ]

    return {
      nodes,
      adjacencyList,
      edges,
      isDirected: false
    }
  }
}
