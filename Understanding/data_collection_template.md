# Data Collection Template

Use this template to systematically collect performance data for your analysis.

## Sorting Algorithm Performance

### Test Configuration
- Computer Specs: [Your CPU, RAM]
- Compiler: g++ -std=c++17 -O2
- Test Date: [Date]

### Data Collection Table

#### Array Sizes Tested
| Algorithm | n=1000 | n=5000 | n=10000 | n=50000 |
|-----------|---------|---------|----------|----------|
| **Bubble Sort** |  |  |  |  |
| - Comparisons | | | | |
| - Swaps | | | | |
| - Time (ms) | | | | |
| **Insertion Sort** |  |  |  |  |
| - Comparisons | | | | |
| - Swaps | | | | |
| - Time (ms) | | | | |
| **Merge Sort** |  |  |  |  |
| - Comparisons | | | | |
| - Time (ms) | | | | |
| **Quick Sort** |  |  |  |  |
| - Comparisons | | | | |
| - Swaps | | | | |
| - Time (ms) | | | | |

#### Input Distribution Impact (n=10000)
| Algorithm | Random | Sorted | Reverse | Nearly Sorted |
|-----------|---------|---------|----------|----------|
| **Bubble Sort Time** | | | | |
| **Insertion Sort Time** | | | | |
| **Merge Sort Time** | | | | |
| **Quick Sort Time** | | | | |

## Search Algorithm Performance

#### Search Performance (Array size = 50000)
| Algorithm | Comparisons | Time (ms) | Notes |
|-----------|-------------|-----------|-------|
| Linear Search | | | |
| Binary Search | | | (on sorted array) |

## Recursion Performance

#### Fibonacci Comparison
| n | Naive Calls | Naive Time (ms) | Memo Calls | Memo Time (ms) |
|---|-------------|-----------------|------------|---------------|
| 10 | | | | |
| 20 | | | | |
| 30 | | | | |
| 35 | | | | |
| 40 | | | | |

#### Factorial Performance
| n | Call Count | Time (ms) |
|---|------------|-----------|
| 10 | | |
| 15 | | |
| 20 | | |

## Observations to Record

### Performance Surprises
- [ ] When did simple algorithms outperform complex ones?
- [ ] What unexpected timing patterns did you observe?
- [ ] How did input distribution affect different algorithms?

### Theoretical vs Actual
- [ ] Which algorithms matched theoretical predictions?
- [ ] Where did constant factors matter more than Big-O?
- [ ] What role did compiler optimizations play?

### Scaling Behavior
- [ ] Which algorithms became unusable first as n increased?
- [ ] How did memory allocation affect timing?
- [ ] Did any algorithms show cache effects?

## Export Data Format

For plotting, export your data as CSV:

```csv
algorithm,size,time_ms,comparisons,swaps
bubble,1000,15.2,500000,250000
bubble,5000,325.6,12500000,6250000
merge,1000,2.1,9966,0
merge,5000,12.3,64608,0
```

## Analysis Questions

1. **Growth Rates**: Do your timing measurements match the theoretical Big-O curves?

2. **Crossover Points**: At what input sizes do O(n log n) algorithms become faster than O(n²)?

3. **Best vs Worst Case**: How does input distribution affect the same algorithm?

4. **Practical Considerations**: When might you choose a "slower" algorithm in real code?

5. **Memory vs Time**: Which algorithms trade memory for speed, and is it worth it?