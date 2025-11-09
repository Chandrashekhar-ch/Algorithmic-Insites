/*
 * 🎯 Complete Algorithm Performance Suite
 * 
 * This comprehensive analysis demonstrates why algorithm optimization
 * is critical for modern software development. We compare algorithms
 * across different categories and show real-world optimization impact.
 * 
 * Real-world Context:
 * - Netflix saves $1M+ annually through recommendation algorithm optimization
 * - Google's PageRank optimization processes billions of pages in seconds
 * - High-frequency trading algorithms make millions in microseconds
 * - Video game engines need 60fps = 16.67ms per frame budget
 * 
 * Categories Analyzed:
 * 1. Sorting Performance (Bubble vs Quick vs STL)
 * 2. Search Optimization (Linear vs Binary vs Hash)
 * 3. Data Structure Efficiency (Array vs Vector vs List)
 * 4. Memory vs Time Trade-offs
 * 5. Real-world Optimization Examples
 */

#include <iostream>
#include <vector>
#include <list>
#include <unordered_map>
#include <algorithm>
#include <chrono>
#include <random>
#include <iomanip>
#include <string>
#include <memory>
#include <functional>
using namespace std;
using namespace std::chrono;

class ComprehensivePerformanceAnalyzer {
private:
    struct BenchmarkResult {
        string category;
        string algorithm;
        long long timeNanos;
        long long timeMicros;
        size_t memoryBytes;
        int operations;
        string complexity;
    };

    vector<BenchmarkResult> allResults;

public:
    void runCompleteAnalysis() {
        cout << "🎯 Complete Algorithm Performance Analysis\n";
        cout << "=========================================\n\n";

        runSortingComparison();
        runSearchComparison();
        runDataStructureComparison();
        runMemoryVsTimeAnalysis();
        runRealWorldOptimizations();
        
        generateComprehensiveReport();
    }

private:
    void runSortingComparison() {
        cout << "1️⃣ Sorting Algorithm Comparison\n";
        cout << "==============================\n";

        const int testSize = 10000;
        vector<int> data = generateRandomData(testSize);

        // Bubble Sort (O(n²))
        auto bubbleData = data;
        auto start = high_resolution_clock::now();
        bubbleSort(bubbleData);
        auto end = high_resolution_clock::now();
        auto bubbleTime = duration_cast<nanoseconds>(end - start).count();

        // STL Sort (O(n log n))
        auto stlData = data;
        start = high_resolution_clock::now();
        sort(stlData.begin(), stlData.end());
        end = high_resolution_clock::now();
        auto stlTime = duration_cast<nanoseconds>(end - start).count();

        allResults.push_back({"Sorting", "Bubble Sort", bubbleTime, bubbleTime/1000, 
                             testSize * sizeof(int), testSize*testSize/2, "O(n²)"});
        allResults.push_back({"Sorting", "STL Sort", stlTime, stlTime/1000, 
                             testSize * sizeof(int), testSize * log2(testSize), "O(n log n)"});

        cout << "📊 Results for " << testSize << " elements:\n";
        cout << "• Bubble Sort: " << bubbleTime/1000 << " μs\n";
        cout << "• STL Sort: " << stlTime/1000 << " μs\n";
        cout << "• Performance Gain: " << fixed << setprecision(1) 
             << (double)bubbleTime/stlTime << "x faster with STL!\n\n";
    }

    void runSearchComparison() {
        cout << "2️⃣ Search Algorithm Comparison\n";
        cout << "=============================\n";

        const int testSize = 100000;
        vector<int> sortedData(testSize);
        for (int i = 0; i < testSize; i++) sortedData[i] = i;

        unordered_map<int, int> hashMap;
        for (int i = 0; i < testSize; i++) hashMap[i] = i;

        int target = testSize - 1; // Worst case for linear search

        // Linear Search
        auto start = high_resolution_clock::now();
        int linearResult = linearSearch(sortedData, target);
        auto end = high_resolution_clock::now();
        auto linearTime = duration_cast<nanoseconds>(end - start).count();

        // Binary Search
        start = high_resolution_clock::now();
        int binaryResult = binarySearch(sortedData, target);
        end = high_resolution_clock::now();
        auto binaryTime = duration_cast<nanoseconds>(end - start).count();

        // Hash Search
        start = high_resolution_clock::now();
        bool hashResult = hashMap.find(target) != hashMap.end();
        end = high_resolution_clock::now();
        auto hashTime = duration_cast<nanoseconds>(end - start).count();

        allResults.push_back({"Search", "Linear Search", linearTime, linearTime/1000, 
                             testSize * sizeof(int), testSize, "O(n)"});
        allResults.push_back({"Search", "Binary Search", binaryTime, binaryTime/1000, 
                             testSize * sizeof(int), log2(testSize), "O(log n)"});
        allResults.push_back({"Search", "Hash Lookup", hashTime, hashTime/1000, 
                             testSize * sizeof(int) * 2, 1, "O(1)"});

        cout << "📊 Results for searching " << testSize << " elements:\n";
        cout << "• Linear Search: " << linearTime/1000 << " μs\n";
        cout << "• Binary Search: " << binaryTime/1000 << " μs\n";
        cout << "• Hash Lookup: " << hashTime/1000 << " μs\n";
        cout << "• Binary vs Linear: " << (double)linearTime/binaryTime << "x faster\n";
        cout << "• Hash vs Linear: " << (double)linearTime/hashTime << "x faster\n\n";
    }

    void runDataStructureComparison() {
        cout << "3️⃣ Data Structure Performance\n";
        cout << "============================\n";

        const int testSize = 100000;
        const int iterations = 1000;

        // Vector random access
        vector<int> vec(testSize);
        for (int i = 0; i < testSize; i++) vec[i] = i;

        auto start = high_resolution_clock::now();
        long long sum = 0;
        for (int i = 0; i < iterations; i++) {
            sum += vec[rand() % testSize];
        }
        auto end = high_resolution_clock::now();
        auto vectorTime = duration_cast<nanoseconds>(end - start).count();

        // List sequential access
        list<int> lst;
        for (int i = 0; i < testSize; i++) lst.push_back(i);

        start = high_resolution_clock::now();
        sum = 0;
        int count = 0;
        for (auto it = lst.begin(); it != lst.end() && count < iterations; ++it, ++count) {
            sum += *it;
        }
        end = high_resolution_clock::now();
        auto listTime = duration_cast<nanoseconds>(end - start).count();

        allResults.push_back({"Data Structure", "Vector Access", vectorTime, vectorTime/1000, 
                             testSize * sizeof(int), iterations, "O(1)"});
        allResults.push_back({"Data Structure", "List Iteration", listTime, listTime/1000, 
                             testSize * sizeof(int) + testSize * 8, iterations, "O(n)"});

        cout << "📊 Results for " << iterations << " operations:\n";
        cout << "• Vector random access: " << vectorTime/1000 << " μs\n";
        cout << "• List sequential: " << listTime/1000 << " μs\n";
        cout << "• Performance difference: " << (double)listTime/vectorTime << "x\n\n";
    }

    void runMemoryVsTimeAnalysis() {
        cout << "4️⃣ Memory vs Time Trade-offs\n";
        cout << "===========================\n";

        // Fibonacci: Recursive vs Memoized vs Iterative
        const int n = 40;

        // Recursive (exponential time, O(1) space)
        auto start = high_resolution_clock::now();
        long long fibRecursive = fibonacci_recursive(n);
        auto end = high_resolution_clock::now();
        auto recursiveTime = duration_cast<microseconds>(end - start).count();

        // Memoized (linear time, O(n) space)
        unordered_map<int, long long> memo;
        start = high_resolution_clock::now();
        long long fibMemoized = fibonacci_memoized(n, memo);
        end = high_resolution_clock::now();
        auto memoizedTime = duration_cast<microseconds>(end - start).count();

        // Iterative (linear time, O(1) space)
        start = high_resolution_clock::now();
        long long fibIterative = fibonacci_iterative(n);
        end = high_resolution_clock::now();
        auto iterativeTime = duration_cast<microseconds>(end - start).count();

        cout << "📊 Fibonacci(" << n << ") calculation:\n";
        cout << "• Recursive: " << recursiveTime << " μs (O(2^n) time, O(1) space)\n";
        cout << "• Memoized: " << memoizedTime << " μs (O(n) time, O(n) space)\n";
        cout << "• Iterative: " << iterativeTime << " μs (O(n) time, O(1) space)\n";
        cout << "• Memoization speedup: " << (double)recursiveTime/memoizedTime << "x\n\n";

        allResults.push_back({"Memory-Time", "Recursive Fib", recursiveTime * 1000, recursiveTime, 
                             sizeof(long long), pow(2, n), "O(2^n)"});
        allResults.push_back({"Memory-Time", "Memoized Fib", memoizedTime * 1000, memoizedTime, 
                             n * sizeof(long long), n, "O(n)"});
        allResults.push_back({"Memory-Time", "Iterative Fib", iterativeTime * 1000, iterativeTime, 
                             sizeof(long long), n, "O(n)"});
    }

    void runRealWorldOptimizations() {
        cout << "5️⃣ Real-world Optimization Examples\n";
        cout << "==================================\n";

        // Cache simulation
        demonstrateCacheOptimization();
        
        // Batch processing
        demonstrateBatchProcessing();
        
        // Algorithm selection based on data characteristics
        demonstrateAdaptiveAlgorithms();
    }

    void demonstrateCacheOptimization() {
        cout << "🚀 Cache Optimization Demo:\n";
        
        const int size = 1000;
        const int lookups = 10000;
        
        // Without cache
        auto start = high_resolution_clock::now();
        int sum = 0;
        for (int i = 0; i < lookups; i++) {
            sum += expensiveCalculation(i % 100); // Simulate repeated calculations
        }
        auto end = high_resolution_clock::now();
        auto noCacheTime = duration_cast<microseconds>(end - start).count();

        // With cache
        unordered_map<int, int> cache;
        start = high_resolution_clock::now();
        sum = 0;
        for (int i = 0; i < lookups; i++) {
            int key = i % 100;
            if (cache.find(key) == cache.end()) {
                cache[key] = expensiveCalculation(key);
            }
            sum += cache[key];
        }
        end = high_resolution_clock::now();
        auto cacheTime = duration_cast<microseconds>(end - start).count();

        cout << "• Without cache: " << noCacheTime << " μs\n";
        cout << "• With cache: " << cacheTime << " μs\n";
        cout << "• Cache speedup: " << (double)noCacheTime/cacheTime << "x faster\n\n";
    }

    void demonstrateBatchProcessing() {
        cout << "📦 Batch Processing Demo:\n";
        
        const int operations = 10000;
        vector<int> data(operations);
        for (int i = 0; i < operations; i++) data[i] = rand() % 1000;

        // Individual processing
        auto start = high_resolution_clock::now();
        vector<int> results1;
        for (int val : data) {
            results1.push_back(processItem(val)); // Individual function calls
        }
        auto end = high_resolution_clock::now();
        auto individualTime = duration_cast<microseconds>(end - start).count();

        // Batch processing
        start = high_resolution_clock::now();
        vector<int> results2 = processBatch(data); // Batch operation
        end = high_resolution_clock::now();
        auto batchTime = duration_cast<microseconds>(end - start).count();

        cout << "• Individual processing: " << individualTime << " μs\n";
        cout << "• Batch processing: " << batchTime << " μs\n";
        cout << "• Batch speedup: " << (double)individualTime/batchTime << "x faster\n\n";
    }

    void demonstrateAdaptiveAlgorithms() {
        cout << "🧠 Adaptive Algorithm Selection:\n";
        
        // Small array - use insertion sort
        vector<int> smallData = generateRandomData(50);
        auto start = high_resolution_clock::now();
        insertionSort(smallData);
        auto end = high_resolution_clock::now();
        auto smallTime = duration_cast<microseconds>(end - start).count();

        // Large array - use quick sort
        vector<int> largeData = generateRandomData(10000);
        start = high_resolution_clock::now();
        sort(largeData.begin(), largeData.end());
        end = high_resolution_clock::now();
        auto largeTime = duration_cast<microseconds>(end - start).count();

        cout << "• Small data (50 elements) with insertion sort: " << smallTime << " μs\n";
        cout << "• Large data (10K elements) with STL sort: " << largeTime << " μs\n";
        cout << "• Adaptive selection gives optimal performance for each case\n\n";
    }

    void generateComprehensiveReport() {
        cout << "📈 Comprehensive Performance Report\n";
        cout << "=================================\n";

        // Group results by category
        map<string, vector<BenchmarkResult>> categorized;
        for (const auto& result : allResults) {
            categorized[result.category].push_back(result);
        }

        for (const auto& [category, results] : categorized) {
            cout << "\n🔸 " << category << " Performance:\n";
            cout << "┌─────────────────┬─────────────┬──────────────┬─────────────┐\n";
            cout << "│ Algorithm       │ Time (μs)   │ Operations   │ Complexity  │\n";
            cout << "├─────────────────┼─────────────┼──────────────┼─────────────┤\n";
            
            for (const auto& result : results) {
                cout << "│ " << left << setw(15) << result.algorithm 
                     << " │ " << right << setw(11) << result.timeMicros
                     << " │ " << right << setw(12) << result.operations
                     << " │ " << left << setw(11) << result.complexity << " │\n";
            }
            cout << "└─────────────────┴─────────────┴──────────────┴─────────────┘\n";
        }

        generateOptimizationGuidelines();
    }

    void generateOptimizationGuidelines() {
        cout << "\n🎯 Optimization Guidelines\n";
        cout << "========================\n";
        
        cout << "\n1. 🚀 Performance Principles:\n";
        cout << "   • Choose the right algorithm for your data size and type\n";
        cout << "   • Consider the trade-off between time and space complexity\n";
        cout << "   • Profile your specific use case - don't assume\n";
        cout << "   • Optimize the bottlenecks, not everything\n";
        
        cout << "\n2. 📊 When to Use Each Algorithm:\n";
        cout << "   • Small datasets (< 50): Simple algorithms (insertion sort)\n";
        cout << "   • Large datasets: Efficient algorithms (merge/quick sort)\n";
        cout << "   • Frequent searches: Preprocessing (sorting, hashing)\n";
        cout << "   • Memory-constrained: Space-efficient algorithms\n";
        
        cout << "\n3. 🔧 Practical Optimizations:\n";
        cout << "   • Cache frequently accessed data\n";
        cout << "   • Use batch processing for multiple operations\n";
        cout << "   • Implement lazy evaluation when possible\n";
        cout << "   • Choose appropriate data structures\n";
        
        cout << "\n4. 🌍 Industry Applications:\n";
        cout << "   • Web Search: Inverted indexes + caching\n";
        cout << "   • Social Media: Graph algorithms + recommendations\n";
        cout << "   • E-commerce: Search optimization + personalization\n";
        cout << "   • Gaming: Real-time algorithms + spatial partitioning\n";
        cout << "   • Finance: High-frequency trading algorithms\n";
        
        cout << "\n💡 Remember: Premature optimization is the root of all evil,\n";
        cout << "    but knowing your algorithms is the foundation of good software!\n";
    }

    // Helper functions
    vector<int> generateRandomData(int size) {
        vector<int> data(size);
        random_device rd;
        mt19937 gen(rd());
        uniform_int_distribution<> dis(1, 10000);
        
        for (int& val : data) {
            val = dis(gen);
        }
        return data;
    }

    void bubbleSort(vector<int>& arr) {
        int n = arr.size();
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    swap(arr[j], arr[j + 1]);
                }
            }
        }
    }

    void insertionSort(vector<int>& arr) {
        int n = arr.size();
        for (int i = 1; i < n; i++) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
        }
    }

    int linearSearch(const vector<int>& arr, int target) {
        for (int i = 0; i < arr.size(); i++) {
            if (arr[i] == target) return i;
        }
        return -1;
    }

    int binarySearch(const vector<int>& arr, int target) {
        int left = 0, right = arr.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    long long fibonacci_recursive(int n) {
        if (n <= 1) return n;
        return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2);
    }

    long long fibonacci_memoized(int n, unordered_map<int, long long>& memo) {
        if (n <= 1) return n;
        if (memo.find(n) != memo.end()) return memo[n];
        memo[n] = fibonacci_memoized(n - 1, memo) + fibonacci_memoized(n - 2, memo);
        return memo[n];
    }

    long long fibonacci_iterative(int n) {
        if (n <= 1) return n;
        long long a = 0, b = 1;
        for (int i = 2; i <= n; i++) {
            long long temp = a + b;
            a = b;
            b = temp;
        }
        return b;
    }

    int expensiveCalculation(int n) {
        // Simulate expensive computation
        int result = 0;
        for (int i = 0; i < 1000; i++) {
            result += (n * i) % 97;
        }
        return result;
    }

    int processItem(int item) {
        // Simulate individual processing overhead
        return item * 2 + 1;
    }

    vector<int> processBatch(const vector<int>& items) {
        // Simulate efficient batch processing
        vector<int> results;
        results.reserve(items.size()); // Pre-allocate
        
        for (int item : items) {
            results.push_back(item * 2 + 1);
        }
        return results;
    }
};

int main() {
    cout << "=== 🎯 Complete Algorithm Performance Analysis ===\n\n";
    
    ComprehensivePerformanceAnalyzer analyzer;
    analyzer.runCompleteAnalysis();
    
    cout << "\n🌟 Course Project Value:\n";
    cout << "This analysis demonstrates:\n";
    cout << "• Algorithm complexity theory in practice\n";
    cout << "• Performance measurement and profiling techniques\n";
    cout << "• Real-world optimization strategies\n";
    cout << "• Trade-offs in software engineering decisions\n";
    cout << "• Industry-relevant problem-solving approaches\n";
    
    cout << "\nPress any key to continue...";
    cin.get();
    
    return 0;
}