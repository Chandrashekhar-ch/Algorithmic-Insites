/**
 * Insertion Sort Algorithm Implementation with Step-by-Step State Tracking
 */

export interface InsertionSortState {
  arrayState: number[]
  comparedIndices: [number, number] | null
  swappedIndices: [number, number] | null
  insertingElement: number | null
  sortedBoundary: number
  comparisons: number
  swaps: number
}

/**
 * Generator function that performs insertion sort and yields state after each operation
 */
export function* insertionSort(inputArray: number[]): Generator<InsertionSortState, InsertionSortState, unknown> {
  const array = [...inputArray]
  let comparisons = 0
  let swaps = 0
  const n = array.length

  if (n <= 1) {
    yield {
      arrayState: [...array],
      comparedIndices: null,
      swappedIndices: null,
      insertingElement: null,
      sortedBoundary: n,
      comparisons,
      swaps,
    }
    return {
      arrayState: [...array],
      comparedIndices: null,
      swappedIndices: null,
      insertingElement: null,
      sortedBoundary: n,
      comparisons,
      swaps,
    }
  }

  // First element is considered sorted
  yield {
    arrayState: [...array],
    comparedIndices: null,
    swappedIndices: null,
    insertingElement: null,
    sortedBoundary: 1,
    comparisons,
    swaps,
  }

  for (let i = 1; i < n; i++) {
    const key = array[i]
    
    // Safety check for key
    if (key === undefined) {
      continue
    }
    
    let j = i - 1

    // Show the element we're about to insert
    yield {
      arrayState: [...array],
      comparedIndices: null,
      swappedIndices: null,
      insertingElement: i,
      sortedBoundary: i,
      comparisons,
      swaps,
    }

    // Move elements that are greater than key one position ahead
    while (j >= 0) {
      comparisons++

      // Show comparison
      yield {
        arrayState: [...array],
        comparedIndices: [j, i],
        swappedIndices: null,
        insertingElement: i,
        sortedBoundary: i,
        comparisons,
        swaps,
      }

      // Check array bounds and null safety
      const currentElement = array[j]
      if (currentElement === undefined) {
        j--
        continue
      }

      if (currentElement <= key) {
        break
      }

      // Shift element to the right
      array[j + 1] = currentElement
      swaps++

      // Show the shift
      yield {
        arrayState: [...array],
        comparedIndices: null,
        swappedIndices: [j, j + 1],
        insertingElement: i,
        sortedBoundary: i,
        comparisons,
        swaps,
      }

      j--
    }

    // Insert the key at its correct position
    array[j + 1] = key

    // Show the final insertion
    yield {
      arrayState: [...array],
      comparedIndices: null,
      swappedIndices: null,
      insertingElement: null,
      sortedBoundary: i + 1,
      comparisons,
      swaps,
    }
  }

  // Final state
  return {
    arrayState: [...array],
    comparedIndices: null,
    swappedIndices: null,
    insertingElement: null,
    sortedBoundary: n,
    comparisons,
    swaps,
  }
}

/**
 * Utility function to get all insertion sort steps
 */
export function getInsertionSortSteps(inputArray: number[]): InsertionSortState[] {
  const steps: InsertionSortState[] = []
  const generator = insertionSort(inputArray)
  
  let result = generator.next()
  while (!result.done) {
    steps.push(result.value)
    result = generator.next()
  }
  
  if (result.value) {
    steps.push(result.value)
  }
  
  return steps
}
