#!/usr/bin/env python3
"""
Sample plotting script for Algorithm Insights performance analysis.
Students can modify this to visualize their collected data.

Usage:
1. Export your timing data to CSV format
2. Modify the data loading section below
3. Run: python plot_analysis.py
"""

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.patches import Rectangle

# Sample data - replace with your actual measurements
def create_sample_data():
    """Replace this with actual CSV loading: pd.read_csv('your_data.csv')"""
    
    # Sample timing data (replace with your measurements)
    sizes = np.array([1000, 2000, 5000, 10000, 20000])
    
    # Sorting algorithm times (milliseconds) - replace with your data
    bubble_times = np.array([12, 45, 280, 1100, 4400])      # O(n²)
    insertion_times = np.array([8, 30, 190, 750, 3000])     # O(n²) 
    merge_times = np.array([2, 4, 12, 25, 55])              # O(n log n)
    quick_times = np.array([1.5, 3.5, 10, 22, 48])         # O(n log n)
    
    # Search times for different array sizes
    search_sizes = np.array([1000, 5000, 10000, 50000, 100000])
    linear_search = np.array([0.8, 4.2, 8.5, 42, 85])      # O(n)
    binary_search = np.array([0.01, 0.015, 0.018, 0.025, 0.028])  # O(log n)
    
    return {
        'sizes': sizes,
        'bubble': bubble_times,
        'insertion': insertion_times, 
        'merge': merge_times,
        'quick': quick_times,
        'search_sizes': search_sizes,
        'linear': linear_search,
        'binary': binary_search
    }

def plot_sorting_comparison(data):
    """Plot sorting algorithm performance comparison"""
    plt.figure(figsize=(12, 8))
    
    sizes = data['sizes']
    
    # Main comparison plot
    plt.subplot(2, 2, 1)
    plt.plot(sizes, data['bubble'], 'ro-', label='Bubble Sort O(n²)', linewidth=2, markersize=6)
    plt.plot(sizes, data['insertion'], 'bo-', label='Insertion Sort O(n²)', linewidth=2, markersize=6)
    plt.plot(sizes, data['merge'], 'go-', label='Merge Sort O(n log n)', linewidth=2, markersize=6)
    plt.plot(sizes, data['quick'], 'mo-', label='Quick Sort O(n log n)', linewidth=2, markersize=6)
    
    plt.xlabel('Input Size (n)')
    plt.ylabel('Time (milliseconds)')
    plt.title('Sorting Algorithm Performance Comparison')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Log scale comparison
    plt.subplot(2, 2, 2)
    plt.loglog(sizes, data['bubble'], 'ro-', label='Bubble Sort')
    plt.loglog(sizes, data['insertion'], 'bo-', label='Insertion Sort')
    plt.loglog(sizes, data['merge'], 'go-', label='Merge Sort')
    plt.loglog(sizes, data['quick'], 'mo-', label='Quick Sort')
    
    # Add theoretical curves
    x_theory = np.linspace(sizes[0], sizes[-1], 100)
    plt.loglog(x_theory, (x_theory/1000)**2 * 10, 'r--', alpha=0.5, label='Theoretical O(n²)')
    plt.loglog(x_theory, (x_theory/1000) * np.log2(x_theory/1000) * 2, 'g--', alpha=0.5, label='Theoretical O(n log n)')
    
    plt.xlabel('Input Size (n) - Log Scale')
    plt.ylabel('Time (ms) - Log Scale')
    plt.title('Log-Log Scale: Theory vs Practice')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Efficient algorithms only (zoomed view)
    plt.subplot(2, 2, 3)
    plt.plot(sizes, data['merge'], 'go-', label='Merge Sort', linewidth=2, markersize=6)
    plt.plot(sizes, data['quick'], 'mo-', label='Quick Sort', linewidth=2, markersize=6)
    
    plt.xlabel('Input Size (n)')
    plt.ylabel('Time (milliseconds)')
    plt.title('O(n log n) Algorithms Comparison')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Growth rate analysis
    plt.subplot(2, 2, 4)
    
    # Calculate growth rates (time[i+1] / time[i])
    bubble_growth = data['bubble'][1:] / data['bubble'][:-1]
    merge_growth = data['merge'][1:] / data['merge'][:-1]
    
    x_pos = np.arange(len(bubble_growth))
    plt.bar(x_pos - 0.2, bubble_growth, 0.4, label='Bubble Sort Growth Rate', alpha=0.7)
    plt.bar(x_pos + 0.2, merge_growth, 0.4, label='Merge Sort Growth Rate', alpha=0.7)
    
    plt.xlabel('Size Transition')
    plt.ylabel('Time Ratio (t[i+1]/t[i])')
    plt.title('Performance Growth Rates')
    plt.xticks(x_pos, [f'{sizes[i]}->{sizes[i+1]}' for i in range(len(sizes)-1)], rotation=45)
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('sorting_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()

def plot_search_comparison(data):
    """Plot search algorithm comparison"""
    plt.figure(figsize=(10, 6))
    
    sizes = data['search_sizes']
    
    plt.subplot(1, 2, 1)
    plt.plot(sizes, data['linear'], 'ro-', label='Linear Search O(n)', linewidth=2, markersize=6)
    plt.plot(sizes, data['binary'], 'bo-', label='Binary Search O(log n)', linewidth=2, markersize=6)
    
    plt.xlabel('Array Size (n)')
    plt.ylabel('Time (milliseconds)')
    plt.title('Search Algorithm Comparison')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Efficiency ratio
    plt.subplot(1, 2, 2)
    efficiency_ratio = data['linear'] / data['binary']
    plt.plot(sizes, efficiency_ratio, 'go-', linewidth=2, markersize=6)
    plt.xlabel('Array Size (n)')
    plt.ylabel('Linear Time / Binary Time')
    plt.title('Binary Search Efficiency Advantage')
    plt.grid(True, alpha=0.3)
    
    # Add text annotations
    for i, (size, ratio) in enumerate(zip(sizes, efficiency_ratio)):
        plt.annotate(f'{ratio:.1f}x', (size, ratio), 
                    textcoords="offset points", xytext=(0,10), ha='center')
    
    plt.tight_layout()
    plt.savefig('search_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()

def plot_fibonacci_analysis():
    """Plot Fibonacci recursion analysis"""
    n_values = np.array([10, 15, 20, 25, 30, 35, 40])
    
    # Sample data - replace with your measurements
    naive_calls = np.array([177, 1973, 21891, 242785, 2692537, 29860703, 331160281])
    memo_calls = np.array([19, 29, 39, 49, 59, 69, 79])  # Linear growth
    
    naive_times = np.array([0.001, 0.01, 0.1, 1.2, 13.5, 152, 1680])  # Exponential
    memo_times = np.array([0.001, 0.001, 0.001, 0.001, 0.002, 0.002, 0.002])  # Constant
    
    plt.figure(figsize=(12, 5))
    
    # Call count comparison
    plt.subplot(1, 2, 1)
    plt.semilogy(n_values, naive_calls, 'ro-', label='Naive Fibonacci O(2ⁿ)', linewidth=2)
    plt.semilogy(n_values, memo_calls, 'bo-', label='Memoized Fibonacci O(n)', linewidth=2)
    
    plt.xlabel('n (Fibonacci number)')
    plt.ylabel('Function Calls (log scale)')
    plt.title('Recursive Calls: Naive vs Memoized')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Time comparison
    plt.subplot(1, 2, 2)
    plt.semilogy(n_values, naive_times, 'ro-', label='Naive Fibonacci', linewidth=2)
    plt.semilogy(n_values, memo_times, 'bo-', label='Memoized Fibonacci', linewidth=2)
    
    plt.xlabel('n (Fibonacci number)')
    plt.ylabel('Time (milliseconds, log scale)')
    plt.title('Execution Time: Exponential vs Linear')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Add annotations for dramatic differences
    plt.annotate(f'n=40: {naive_times[-1]/memo_times[-1]:.0f}x slower!', 
                xy=(40, naive_times[-1]), xytext=(35, naive_times[-1]*10),
                arrowprops=dict(arrowstyle='->', color='red'))
    
    plt.tight_layout()
    plt.savefig('fibonacci_analysis.png', dpi=300, bbox_inches='tight')
    plt.show()

def create_complexity_cheatsheet():
    """Create a visual complexity reference"""
    fig, ax = plt.subplots(figsize=(12, 8))
    
    n = np.logspace(1, 4, 1000)  # From 10 to 10,000
    
    # Plot common complexities
    ax.loglog(n, np.ones_like(n), label='O(1) - Hash table lookup', linewidth=3)
    ax.loglog(n, np.log2(n), label='O(log n) - Binary search', linewidth=3)
    ax.loglog(n, n, label='O(n) - Linear search', linewidth=3)
    ax.loglog(n, n * np.log2(n), label='O(n log n) - Merge/Quick sort', linewidth=3)
    ax.loglog(n, n**2, label='O(n²) - Bubble/Insertion sort', linewidth=3)
    ax.loglog(n, 2**np.log2(n), label='O(2ⁿ) - Naive Fibonacci', linewidth=3)
    
    # Add performance regions
    ax.axvspan(1, 100, alpha=0.1, color='green', label='Small n: Simple algorithms OK')
    ax.axvspan(100, 10000, alpha=0.1, color='yellow', label='Medium n: Efficiency matters')
    ax.axvspan(10000, 100000, alpha=0.1, color='red', label='Large n: Only efficient algorithms')
    
    ax.set_xlabel('Input Size (n)')
    ax.set_ylabel('Operations / Time (arbitrary units)')
    ax.set_title('Algorithm Complexity Comparison')
    ax.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
    ax.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('complexity_cheatsheet.png', dpi=300, bbox_inches='tight')
    plt.show()

def main():
    """Main analysis function"""
    print("Algorithm Performance Analysis")
    print("=" * 40)
    
    # Load data (replace with your CSV loading)
    data = create_sample_data()
    
    print("Generating performance analysis plots...")
    
    # Create all analysis plots
    plot_sorting_comparison(data)
    print("✓ Sorting algorithm comparison saved as 'sorting_analysis.png'")
    
    plot_search_comparison(data)
    print("✓ Search algorithm comparison saved as 'search_analysis.png'")
    
    plot_fibonacci_analysis()
    print("✓ Fibonacci recursion analysis saved as 'fibonacci_analysis.png'")
    
    create_complexity_cheatsheet()
    print("✓ Complexity reference chart saved as 'complexity_cheatsheet.png'")
    
    print("\nAnalysis complete! Use these plots in your report.")
    print("\nTo use your own data:")
    print("1. Export measurements to CSV format")
    print("2. Replace the create_sample_data() function")
    print("3. Modify column names to match your CSV structure")

if __name__ == "__main__":
    # Install required packages if needed:
    # pip install matplotlib pandas numpy
    
    try:
        main()
    except ImportError as e:
        print(f"Missing required package: {e}")
        print("Install with: pip install matplotlib pandas numpy")
    except Exception as e:
        print(f"Error: {e}")
        print("Make sure you have the required data and packages installed.")