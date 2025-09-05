/**
 * Selection Sort Algorithm Implementation with Step-by-Step State Tracking
 */

export interface SelectionSortState {
  arrayState: number[]
  comparedIndices: [number, number] | null
  swappedIndices: [number, number] | null
  currentMinIndex: number | null
  sortedBoundary: number
  comparisons: number
  swaps: number
}

/**
 * Generator function that performs selection sort and yields state after each operation
 */
export function* selectionSort(inputArray: number[]): Generator<SelectionSortState, SelectionSortState, unknown> {
  const array = [...inputArray]
  let comparisons = 0
  let swaps = 0
  const n = array.length

  if (n <= 1) {
    yield {
      arrayState: [...array],
      comparedIndices: null,
      swappedIndices: null,
      currentMinIndex: null,
      sortedBoundary: n,
      comparisons,
      swaps,
    }
    return {
      arrayState: [...array],
      comparedIndices: null,
      swappedIndices: null,
      currentMinIndex: null,
      sortedBoundary: n,
      comparisons,
      swaps,
    }
  }

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i

    // Yield state showing the start of a new pass
    yield {
      arrayState: [...array],
      comparedIndices: null,
      swappedIndices: null,
      currentMinIndex: minIndex,
      sortedBoundary: i,
      comparisons,
      swaps,
    }

    // Find the minimum element in the remaining unsorted array
    for (let j = i + 1; j < n; j++) {
      comparisons++

      // Yield state showing comparison
      yield {
        arrayState: [...array],
        comparedIndices: [minIndex, j],
        swappedIndices: null,
        currentMinIndex: minIndex,
        sortedBoundary: i,
        comparisons,
        swaps,
      }

      // Compare elements with safety checks
      const currentElement = array[j]
      const minElement = array[minIndex]
      
      if (currentElement === undefined || minElement === undefined) {
        continue
      }

      if (currentElement < minElement) {
        minIndex = j

        // Yield state showing new minimum found
        yield {
          arrayState: [...array],
          comparedIndices: null,
          swappedIndices: null,
          currentMinIndex: minIndex,
          sortedBoundary: i,
          comparisons,
          swaps,
        }
      }
    }

    // Swap the found minimum element with the first element
    if (minIndex !== i) {
      const temp = array[i]
      const minTemp = array[minIndex]
      
      if (temp !== undefined && minTemp !== undefined) {
        array[i] = minTemp
        array[minIndex] = temp
        swaps++
      }

      // Yield state showing the swap
      yield {
        arrayState: [...array],
        comparedIndices: null,
        swappedIndices: [i, minIndex],
        currentMinIndex: null,
        sortedBoundary: i + 1,
        comparisons,
        swaps,
      }
    }

    // Yield state showing the sorted boundary has moved
    yield {
      arrayState: [...array],
      comparedIndices: null,
      swappedIndices: null,
      currentMinIndex: null,
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
    currentMinIndex: null,
    sortedBoundary: n,
    comparisons,
    swaps,
  }
}

/**
 * Utility function to get all selection sort steps
 */
export function getSelectionSortSteps(inputArray: number[]): SelectionSortState[] {
  const steps: SelectionSortState[] = []
  const generator = selectionSort(inputArray)
  
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
