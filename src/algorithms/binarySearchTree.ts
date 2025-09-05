export interface BinarySearchTreeNode {
  value: number
  left: BinarySearchTreeNode | null
  right: BinarySearchTreeNode | null
  id: string
  isHighlighted?: boolean
  isComparing?: boolean
  isSwapping?: boolean
}

export interface BSTVisualizationStep {
  type: 'search' | 'insert' | 'delete' | 'compare' | 'found' | 'not-found'
  node: BinarySearchTreeNode | null
  targetValue?: number
  description: string
  pathFromRoot: string[]
  currentNode: string | null
  compareNode?: string | null
  statistics: {
    comparisons: number
    depth: number
    nodesVisited: number
  }
}

export class BinarySearchTree {
  root: BinarySearchTreeNode | null = null
  private nodeIdCounter = 0

  private generateId(): string {
    return `node_${this.nodeIdCounter++}`
  }

  *search(value: number): Generator<BSTVisualizationStep> {
    let current = this.root
    const pathFromRoot: string[] = []
    let comparisons = 0
    let depth = 0
    let nodesVisited = 0

    if (!current) {
      yield {
        type: 'not-found',
        node: null,
        targetValue: value,
        description: `Tree is empty. Value ${value} not found.`,
        pathFromRoot: [],
        currentNode: null,
        statistics: { comparisons: 0, depth: 0, nodesVisited: 0 }
      }
      return null
    }

    while (current) {
      nodesVisited++
      pathFromRoot.push(current.id)

      // Highlight current node being compared
      current.isComparing = true
      yield {
        type: 'compare',
        node: current,
        targetValue: value,
        description: `Comparing ${value} with ${current.value}`,
        pathFromRoot: [...pathFromRoot],
        currentNode: current.id,
        statistics: { comparisons, depth, nodesVisited }
      }

      current.isComparing = false
      comparisons++

      if (value === current.value) {
        current.isHighlighted = true
        yield {
          type: 'found',
          node: current,
          targetValue: value,
          description: `Found ${value} at depth ${depth}`,
          pathFromRoot: [...pathFromRoot],
          currentNode: current.id,
          statistics: { comparisons, depth, nodesVisited }
        }
        current.isHighlighted = false
        return current
      } else if (value < current.value) {
        depth++
        const nextNode: BinarySearchTreeNode | null = current.left
        current = nextNode
        if (current) {
          yield {
            type: 'search',
            node: current,
            targetValue: value,
            description: `${value} < ${current.value}, moving to left child`,
            pathFromRoot: [...pathFromRoot],
            currentNode: current.id,
            statistics: { comparisons, depth, nodesVisited }
          }
        }
      } else {
        depth++
        const nextNode: BinarySearchTreeNode | null = current.right
        current = nextNode
        if (current) {
          yield {
            type: 'search',
            node: current,
            targetValue: value,
            description: `${value} > ${current.value}, moving to right child`,
            pathFromRoot: [...pathFromRoot],
            currentNode: current.id,
            statistics: { comparisons, depth, nodesVisited }
          }
        }
      }
    }

    yield {
      type: 'not-found',
      node: null,
      targetValue: value,
      description: `Value ${value} not found in tree`,
      pathFromRoot: [...pathFromRoot],
      currentNode: null,
      statistics: { comparisons, depth, nodesVisited }
    }

    return null
  }

  *insert(value: number): Generator<BSTVisualizationStep> {
    const newNode: BinarySearchTreeNode = {
      value,
      left: null,
      right: null,
      id: this.generateId(),
      isHighlighted: false,
      isComparing: false
    }

    if (!this.root) {
      this.root = newNode
      newNode.isHighlighted = true
      yield {
        type: 'insert',
        node: newNode,
        targetValue: value,
        description: `Inserted ${value} as root node`,
        pathFromRoot: [newNode.id],
        currentNode: newNode.id,
        statistics: { comparisons: 0, depth: 0, nodesVisited: 1 }
      }
      newNode.isHighlighted = false
      return newNode
    }

    let current = this.root
    let parent: BinarySearchTreeNode | null = null
    const pathFromRoot: string[] = []
    let comparisons = 0
    let depth = 0
    let nodesVisited = 0

    while (current) {
      nodesVisited++
      pathFromRoot.push(current.id)
      parent = current

      // Highlight current node being compared
      current.isComparing = true
      yield {
        type: 'compare',
        node: current,
        targetValue: value,
        description: `Comparing ${value} with ${current.value}`,
        pathFromRoot: [...pathFromRoot],
        currentNode: current.id,
        statistics: { comparisons, depth, nodesVisited }
      }

      current.isComparing = false
      comparisons++

      if (value === current.value) {
        yield {
          type: 'found',
          node: current,
          targetValue: value,
          description: `Value ${value} already exists in tree`,
          pathFromRoot: [...pathFromRoot],
          currentNode: current.id,
          statistics: { comparisons, depth, nodesVisited }
        }
        return current
      } else if (value < current.value) {
        depth++
        const nextLeft = current.left
        if (!nextLeft) {
          if (parent) {
            parent.left = newNode
            pathFromRoot.push(newNode.id)
            newNode.isHighlighted = true
            yield {
              type: 'insert',
              node: newNode,
              targetValue: value,
              description: `Inserted ${value} as left child of ${parent.value}`,
              pathFromRoot: [...pathFromRoot],
              currentNode: newNode.id,
              statistics: { comparisons, depth, nodesVisited: nodesVisited + 1 }
            }
            newNode.isHighlighted = false
            return newNode
          }
          break
        }
        current = nextLeft
      } else {
        depth++
        const nextRight = current.right
        if (!nextRight) {
          if (parent) {
            parent.right = newNode
            pathFromRoot.push(newNode.id)
            newNode.isHighlighted = true
            yield {
              type: 'insert',
              node: newNode,
              targetValue: value,
              description: `Inserted ${value} as right child of ${parent.value}`,
              pathFromRoot: [...pathFromRoot],
              currentNode: newNode.id,
              statistics: { comparisons, depth, nodesVisited: nodesVisited + 1 }
            }
            newNode.isHighlighted = false
            return newNode
          }
          break
        }
        current = nextRight
      }
    }

    return newNode
  }

  // Helper method to convert tree to d3 hierarchy format
  toD3Format(): any {
    const convertNode = (node: BinarySearchTreeNode | null): any => {
      if (!node) return null

      const result: any = {
        id: node.id,
        value: node.value,
        isHighlighted: node.isHighlighted,
        isComparing: node.isComparing,
        isSwapping: node.isSwapping,
        children: []
      }

      if (node.left) {
        result.children.push(convertNode(node.left))
      }
      if (node.right) {
        result.children.push(convertNode(node.right))
      }

      return result
    }

    return convertNode(this.root)
  }

  // Utility method to build a sample tree for demonstration
  buildSampleTree(): void {
    const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45]
    for (const value of values) {
      const generator = this.insert(value)
      // Consume all steps to build the tree
      let result = generator.next()
      while (!result.done) {
        result = generator.next()
      }
    }
  }

  // Method to clear all highlighting
  clearHighlights(): void {
    const clearNode = (node: BinarySearchTreeNode | null) => {
      if (node) {
        node.isHighlighted = false
        node.isComparing = false
        node.isSwapping = false
        clearNode(node.left)
        clearNode(node.right)
      }
    }
    clearNode(this.root)
  }
}
