/*
 * 🔍 Search Algorithm Performance & Optimization
 * 
 * Real-world Context:
 * Search is the foundation of modern applications:
 * - Google processes 8.5 billion searches daily
 * - Netflix uses search to recommend content
 * - Amazon's search drives 70% of purchases
 * 
 * This demonstrates why optimizing search algorithms is crucial
 * for system performance and user experience.
 * 
 * Algorithms Compared:
 * - Linear Search: O(n) - Simple but slow
 * - Binary Search: O(log n) - Fast for sorted data
 * - Jump Search: O(√n) - Good balance for some scenarios
 * - Interpolation Search: O(log log n) - Best for uniformly distributed data
 * - Hash Table Lookup: O(1) average - Fastest for exact matches
 */

#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>
#include <chrono>
#include <random>
#include <iomanip>
#include <string>
#include <cmath>
using namespace std;
using namespace std::chrono;

class SearchPerformanceAnalyzer {
private:
    struct SearchResult {
        string algorithm;
        long long timeMicros;
        bool found;
        int comparisons;
        string complexity;
    };

    vector<SearchResult> results;
    int globalComparisons;

public:
    // Linear Search - O(n)
    int linearSearch(const vector<int>& arr, int target) {
        globalComparisons = 0;
        for (int i = 0; i < arr.size(); i++) {
            globalComparisons++;
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }

    // Binary Search - O(log n) - requires sorted array
    int binarySearch(const vector<int>& arr, int target) {
        globalComparisons = 0;
        int left = 0, right = arr.size() - 1;
        
        while (left <= right) {
            globalComparisons++;
            int mid = left + (right - left) / 2;
            
            if (arr[mid] == target) return mid;
            
            if (arr[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }

    // Jump Search - O(√n) - good compromise
    int jumpSearch(const vector<int>& arr, int target) {
        globalComparisons = 0;
        int n = arr.size();
        int step = sqrt(n);
        int prev = 0;
        
        // Find block where element may be present
        while (prev < n && arr[min(step, n) - 1] < target) {
            globalComparisons++;
            prev = step;
            step += sqrt(n);
            if (prev >= n) return -1;
        }
        
        // Linear search in the identified block
        while (prev < n && prev < step) {
            globalComparisons++;
            if (arr[prev] == target) return prev;
            prev++;
        }
        
        return -1;
    }

    // Interpolation Search - O(log log n) for uniform distribution
    int interpolationSearch(const vector<int>& arr, int target) {
        globalComparisons = 0;
        int low = 0, high = arr.size() - 1;
        
        while (low <= high && target >= arr[low] && target <= arr[high]) {
            globalComparisons++;
            
            if (low == high) {
                if (arr[low] == target) return low;
                return -1;
            }
            
            // Interpolation formula
            int pos = low + (((double)(target - arr[low]) / 
                            (arr[high] - arr[low])) * (high - low));
            
            if (arr[pos] == target) return pos;
            
            if (arr[pos] < target) {
                low = pos + 1;
            } else {
                high = pos - 1;
            }
        }
        
        return -1;
    }

    // Hash Table Search - O(1) average
    bool hashSearch(const unordered_map<int, int>& hashTable, int target) {
        globalComparisons = 1; // O(1) operation
        return hashTable.find(target) != hashTable.end();
    }

    // Performance measurement template
    template<typename SearchFunc>
    SearchResult measureSearchPerformance(SearchFunc searchFunc, 
                                        const string& algoName,
                                        const string& complexity) {
        auto start = high_resolution_clock::now();
        auto result = searchFunc();
        auto end = high_resolution_clock::now();
        
        auto timeMicros = duration_cast<microseconds>(end - start).count();
        
        return {algoName, timeMicros, result != -1, globalComparisons, complexity};
    }

    void runSearchAnalysis(int dataSize) {
        cout << "🔍 Search Algorithm Performance Analysis\n";
        cout << "=======================================\n";
        cout << "Dataset Size: " << dataSize << " elements\n\n";

        // Generate sorted data for most algorithms
        vector<int> sortedData(dataSize);
        for (int i = 0; i < dataSize; i++) {
            sortedData[i] = i * 2; // Even numbers for better distribution
        }

        // Create hash table for O(1) search
        unordered_map<int, int> hashTable;
        for (int i = 0; i < dataSize; i++) {
            hashTable[sortedData[i]] = i;
        }

        // Target to search for (worst case for most algorithms)
        int target = sortedData[dataSize - 1]; // Last element
        
        results.clear();

        cout << "🎯 Searching for target: " << target << "\n";
        cout << "⏳ Running performance tests...\n\n";

        // Test Linear Search
        results.push_back(measureSearchPerformance(
            [&]() { return linearSearch(sortedData, target); },
            "Linear Search", "O(n)"));

        // Test Binary Search
        results.push_back(measureSearchPerformance(
            [&]() { return binarySearch(sortedData, target); },
            "Binary Search", "O(log n)"));

        // Test Jump Search
        results.push_back(measureSearchPerformance(
            [&]() { return jumpSearch(sortedData, target); },
            "Jump Search", "O(√n)"));

        // Test Interpolation Search
        results.push_back(measureSearchPerformance(
            [&]() { return interpolationSearch(sortedData, target); },
            "Interpolation Search", "O(log log n)"));

        // Test Hash Search
        SearchResult hashResult = {"Hash Table Lookup", 0, false, 1, "O(1)"};
        auto start = high_resolution_clock::now();
        bool hashFound = hashSearch(hashTable, target);
        auto end = high_resolution_clock::now();
        hashResult.timeMicros = duration_cast<microseconds>(end - start).count();
        hashResult.found = hashFound;
        results.push_back(hashResult);

        displaySearchResults();
        analyzeSearchPerformance();
        demonstrateOptimizations();
    }

private:
    void displaySearchResults() {
        cout << "📊 Search Performance Results:\n";
        cout << "┌─────────────────────┬─────────────┬───────┬──────────────┬──────────────┐\n";
        cout << "│ Algorithm           │ Time (μs)   │ Found │ Comparisons  │ Complexity   │\n";
        cout << "├─────────────────────┼─────────────┼───────┼──────────────┼──────────────┤\n";
        
        for (const auto& result : results) {
            cout << "│ " << left << setw(19) << result.algorithm 
                 << " │ " << right << setw(11) << result.timeMicros
                 << " │ " << center << setw(5) << (result.found ? "Yes" : "No")
                 << " │ " << right << setw(12) << result.comparisons
                 << " │ " << left << setw(12) << result.complexity << " │\n";
        }
        cout << "└─────────────────────┴─────────────┴───────┴──────────────┴──────────────┘\n";
    }

    void analyzeSearchPerformance() {
        cout << "\n🎯 Performance Analysis:\n";
        
        // Find fastest and slowest
        auto fastest = *min_element(results.begin(), results.end(),
            [](const SearchResult& a, const SearchResult& b) {
                return a.timeMicros < b.timeMicros;
            });
        
        auto slowest = *max_element(results.begin(), results.end(),
            [](const SearchResult& a, const SearchResult& b) {
                return a.timeMicros < b.timeMicros;
            });

        cout << "🏆 Fastest: " << fastest.algorithm << " (" << fastest.timeMicros << " μs, " 
             << fastest.comparisons << " comparisons)\n";
        cout << "🐌 Slowest: " << slowest.algorithm << " (" << slowest.timeMicros << " μs, " 
             << slowest.comparisons << " comparisons)\n";
        
        if (slowest.timeMicros > 0) {
            double speedup = (double)slowest.timeMicros / fastest.timeMicros;
            cout << "⚡ Performance Gain: " << fixed << setprecision(2) 
                 << speedup << "x faster!\n";
        }

        cout << "\n📈 Comparison Efficiency:\n";
        for (const auto& result : results) {
            cout << "• " << result.algorithm << ": " << result.comparisons << " comparisons\n";
        }
    }

    void demonstrateOptimizations() {
        cout << "\n🚀 Search Optimization Strategies:\n";
        cout << "==================================\n";
        
        cout << "\n1. 📚 Data Structure Selection:\n";
        cout << "   • Use hash tables for exact key lookups (O(1))\n";
        cout << "   • Use binary search trees for range queries\n";
        cout << & "   • Use tries for prefix matching (autocomplete)\n";
        
        cout << "\n2. 🎯 Algorithm Selection by Use Case:\n";
        cout << "   • Small datasets (< 100): Linear search is fine\n";
        cout << "   • Large sorted data: Binary search\n";
        cout << "   • Uniformly distributed: Interpolation search\n";
        cout << "   • Memory-constrained: Jump search\n";
        cout << "   • Frequent searches: Hash table preprocessing\n";
        
        cout << "\n3. 🔧 Practical Optimizations:\n";
        cout << "   • Cache frequently accessed items\n";
        cout << "   • Use bloom filters for negative lookups\n";
        cout << "   • Implement early termination conditions\n";
        cout << "   • Optimize for specific data distributions\n";
        
        cout << "\n4. 🌐 Real-world Examples:\n";
        cout << "   • Google: Inverted index + PageRank optimization\n";
        cout << "   • Netflix: Collaborative filtering + caching\n";
        cout << "   • Amazon: Product search + recommendation engine\n";
        cout << "   • Database: B-tree indexes + query optimization\n";
        
        demonstrateSpecializedSearch();
    }

    void demonstrateSpecializedSearch() {
        cout << "\n🔬 Specialized Search Demonstration:\n";
        
        // Demonstrate binary search variations
        vector<int> data = {1, 3, 5, 7, 9, 11, 13, 15, 17, 19};
        
        cout << "\n📍 Binary Search Variations on: [1,3,5,7,9,11,13,15,17,19]\n";
        
        // Find first occurrence
        auto findFirst = [&](int target) {
            int left = 0, right = data.size() - 1, result = -1;
            while (left <= right) {
                int mid = left + (right - left) / 2;
                if (data[mid] == target) {
                    result = mid;
                    right = mid - 1; // Continue searching left
                } else if (data[mid] < target) {
                    left = mid + 1;
                } else {
                    right = mid - 1;
                }
            }
            return result;
        };
        
        // Find insertion point
        auto findInsertionPoint = [&](int target) {
            int left = 0, right = data.size();
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (data[mid] < target) {
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            return left;
        };
        
        cout << "• Find 7: index " << findFirst(7) << "\n";
        cout << "• Find 8 (not exists): index " << findFirst(8) << "\n";
        cout << "• Insertion point for 8: " << findInsertionPoint(8) << "\n";
        cout << "• Insertion point for 0: " << findInsertionPoint(0) << "\n";
        cout << "• Insertion point for 20: " << findInsertionPoint(20) << "\n";
    }

    // Helper function for centered text
    string center(int width) const {
        return " ";
    }
};

int main() {
    SearchPerformanceAnalyzer analyzer;
    
    cout << "=== 🔍 Search Algorithm Optimization Demo ===\n\n";
    
    // Test different data sizes
    vector<int> testSizes = {1000, 10000, 100000};
    
    for (int size : testSizes) {
        analyzer.runSearchAnalysis(size);
        cout << "\n" << string(70, '=') << "\n\n";
    }
    
    cout << "💡 Key Takeaways:\n";
    cout << "• Choose the right algorithm for your data and access patterns\n";
    cout << "• Preprocessing (sorting, hashing) can dramatically improve performance\n";
    cout << "• Consider the trade-offs: time vs space vs implementation complexity\n";
    cout << "• Profile your specific use case - theoretical complexity isn't everything\n";
    cout << "• Modern applications often use hybrid approaches and caching\n";
    
    cout << "\nPress any key to continue...";
    cin.get();
    
    return 0;
}