/**
 * Bubble Sort Algorithm Implementation with Step-by-Step State Tracking
 * 
 * This generator function implements the bubble sort algorithm and yields
 * the state after every comparison and swap operation for visualization purposes.
 */

export interface BubbleSortState {
  arrayState: number[]
  comparedIndices: [number, number] | null
  swappedIndices: [number, number] | null
  comparisons: number
  swaps: number
}

/**
 * Generator function that performs bubble sort and yields state after each operation
 * 
 * @param inputArray - The array of numbers to sort
 * @yields BubbleSortState - State object containing current array state and operation details
 */
export function* bubbleSort(inputArray: number[]): Generator<BubbleSortState, BubbleSortState, unknown> {
  // Create a copy of the input array to avoid mutating the original
  const array = [...inputArray]
  let comparisons = 0
  let swaps = 0
  const n = array.length

  // Early return for empty or single-element arrays
  if (n <= 1) {
    yield {
      arrayState: [...array],
      comparedIndices: null,
      swappedIndices: null,
      comparisons,
      swaps,
    }
    return {
      arrayState: [...array],
      comparedIndices: null,
      swappedIndices: null,
      comparisons,
      swaps,
    }
  }

  // Bubble sort implementation with state tracking
  for (let i = 0; i < n - 1; i++) {
    let swappedInThisPass = false

    for (let j = 0; j < n - i - 1; j++) {
      // Ensure array bounds safety
      if (j >= array.length - 1 || j + 1 >= array.length) {
        break
      }
      
      // Yield state before comparison
      comparisons++
      
      // Compare adjacent elements with null safety
      const currentElement = array[j]
      const nextElement = array[j + 1]
      
      if (currentElement === undefined || nextElement === undefined) {
        break
      }
      
      const shouldSwap = currentElement > nextElement
      
      // Yield state after comparison (before potential swap)
      yield {
        arrayState: [...array],
        comparedIndices: [j, j + 1],
        swappedIndices: null,
        comparisons,
        swaps,
      }

      // Perform swap if needed
      if (shouldSwap) {
        // Swap elements with safety checks
        const temp = array[j]
        array[j] = array[j + 1]!
        array[j + 1] = temp!
        swaps++
        swappedInThisPass = true

        // Yield state after swap
        yield {
          arrayState: [...array],
          comparedIndices: null,
          swappedIndices: [j, j + 1],
          comparisons,
          swaps,
        }
      }
    }

    // Early termination optimization: if no swaps occurred in this pass,
    // the array is already sorted
    if (!swappedInThisPass) {
      break
    }
  }

  // Final state - algorithm completed
  return {
    arrayState: [...array],
    comparedIndices: null,
    swappedIndices: null,
    comparisons,
    swaps,
  }
}

/**
 * Utility function to convert the generator to an array of states
 * Useful for getting all steps at once for analysis or testing
 * 
 * @param inputArray - The array to sort
 * @returns Array of all bubble sort states
 */
export function getBubbleSortSteps(inputArray: number[]): BubbleSortState[] {
  const steps: BubbleSortState[] = []
  const generator = bubbleSort(inputArray)
  
  let result = generator.next()
  while (!result.done) {
    steps.push(result.value)
    result = generator.next()
  }
  
  // Add the final return value
  if (result.value) {
    steps.push(result.value)
  }
  
  return steps
}

/**
 * Helper function to get just the final sorted array
 * 
 * @param inputArray - The array to sort
 * @returns The sorted array
 */
export function bubbleSortFinal(inputArray: number[]): number[] {
  const generator = bubbleSort(inputArray)
  let result = generator.next()
  
  while (!result.done) {
    result = generator.next()
  }
  
  return result.value.arrayState
}
