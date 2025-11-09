/*
 * ⚡ Sorting Algorithm Performance Comparison
 * 
 * Real-world Context:
 * Companies like Amazon, Netflix process millions of records daily.
 * Choosing the right sorting algorithm can save hours of computation time.
 * This demonstrates why algorithm selection is critical for performance.
 * 
 * Algorithms Compared:
 * - Bubble Sort: O(n²) - Educational baseline
 * - Selection Sort: O(n²) - Simple but inefficient  
 * - Insertion Sort: O(n²) - Good for small/nearly sorted data
 * - Merge Sort: O(n log n) - Stable, consistent performance
 * - Quick Sort: O(n log n) avg, O(n²) worst - Fast in practice
 * - Heap Sort: O(n log n) - Guaranteed worst-case performance
 * - STL Sort: O(n log n) - Highly optimized hybrid algorithm
 */

#include <iostream>
#include <vector>
#include <algorithm>
#include <chrono>
#include <random>
#include <iomanip>
#include <string>
#include <functional>
using namespace std;
using namespace std::chrono;

class SortingPerformanceAnalyzer {
private:
    struct TestResult {
        string algorithm;
        long long timeMs;
        long long timeMicros;
        string complexity;
        string stability;
    };

    vector<TestResult> results;

public:
    // Bubble Sort - O(n²)
    static void bubbleSort(vector<int>& arr) {
        int n = arr.size();
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    swap(arr[j], arr[j + 1]);
                }
            }
        }
    }

    // Selection Sort - O(n²)
    static void selectionSort(vector<int>& arr) {
        int n = arr.size();
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            swap(arr[i], arr[minIdx]);
        }
    }

    // Insertion Sort - O(n²) but good for small arrays
    static void insertionSort(vector<int>& arr) {
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

    // Merge Sort - O(n log n) stable
    static void merge(vector<int>& arr, int left, int mid, int right) {
        vector<int> temp(right - left + 1);
        int i = left, j = mid + 1, k = 0;
        
        while (i <= mid && j <= right) {
            if (arr[i] <= arr[j]) {
                temp[k++] = arr[i++];
            } else {
                temp[k++] = arr[j++];
            }
        }
        
        while (i <= mid) temp[k++] = arr[i++];
        while (j <= right) temp[k++] = arr[j++];
        
        for (i = left, k = 0; i <= right; i++, k++) {
            arr[i] = temp[k];
        }
    }

    static void mergeSort(vector<int>& arr, int left, int right) {
        if (left < right) {
            int mid = left + (right - left) / 2;
            mergeSort(arr, left, mid);
            mergeSort(arr, mid + 1, right);
            merge(arr, left, mid, right);
        }
    }

    static void mergeSortWrapper(vector<int>& arr) {
        mergeSort(arr, 0, arr.size() - 1);
    }

    // Quick Sort - O(n log n) average
    static int partition(vector<int>& arr, int low, int high) {
        int pivot = arr[high];
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                swap(arr[i], arr[j]);
            }
        }
        swap(arr[i + 1], arr[high]);
        return i + 1;
    }

    static void quickSort(vector<int>& arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }

    static void quickSortWrapper(vector<int>& arr) {
        quickSort(arr, 0, arr.size() - 1);
    }

    // Heap Sort - O(n log n) guaranteed
    static void heapify(vector<int>& arr, int n, int i) {
        int largest = i;
        int left = 2 * i + 1;
        int right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest])
            largest = left;

        if (right < n && arr[right] > arr[largest])
            largest = right;

        if (largest != i) {
            swap(arr[i], arr[largest]);
            heapify(arr, n, largest);
        }
    }

    static void heapSort(vector<int>& arr) {
        int n = arr.size();

        for (int i = n / 2 - 1; i >= 0; i--)
            heapify(arr, n, i);

        for (int i = n - 1; i > 0; i--) {
            swap(arr[0], arr[i]);
            heapify(arr, i, 0);
        }
    }

    // STL Sort - Highly optimized
    static void stlSort(vector<int>& arr) {
        sort(arr.begin(), arr.end());
    }

    // Performance measurement template
    template<typename SortFunc>
    TestResult measurePerformance(SortFunc sortingAlgo, vector<int> data, 
                                 const string& algoName, const string& complexity, 
                                 const string& stability) {
        auto start = high_resolution_clock::now();
        sortingAlgo(data);
        auto end = high_resolution_clock::now();
        
        auto timeMs = duration_cast<milliseconds>(end - start).count();
        auto timeMicros = duration_cast<microseconds>(end - start).count();
        
        return {algoName, timeMs, timeMicros, complexity, stability};
    }

    void runComprehensiveAnalysis(int dataSize, const string& dataType) {
        cout << "🚀 Sorting Performance Analysis\n";
        cout << "================================\n";
        cout << "Dataset: " << dataSize << " integers (" << dataType << ")\n\n";

        vector<int> originalData = generateData(dataSize, dataType);
        results.clear();

        // Test all algorithms (skip slow ones for large datasets)
        if (dataSize <= 10000) {
            cout << "⏳ Testing O(n²) algorithms...\n";
            results.push_back(measurePerformance(bubbleSort, originalData, 
                "Bubble Sort", "O(n²)", "Stable"));
            results.push_back(measurePerformance(selectionSort, originalData, 
                "Selection Sort", "O(n²)", "Unstable"));
            results.push_back(measurePerformance(insertionSort, originalData, 
                "Insertion Sort", "O(n²)", "Stable"));
        }

        cout << "⚡ Testing O(n log n) algorithms...\n";
        results.push_back(measurePerformance(mergeSortWrapper, originalData, 
            "Merge Sort", "O(n log n)", "Stable"));
        results.push_back(measurePerformance(quickSortWrapper, originalData, 
            "Quick Sort", "O(n log n) avg", "Unstable"));
        results.push_back(measurePerformance(heapSort, originalData, 
            "Heap Sort", "O(n log n)", "Unstable"));
        results.push_back(measurePerformance(stlSort, originalData, 
            "STL Sort", "O(n log n)", "Unstable"));

        displayResults();
        analyzeResults();
    }

private:
    vector<int> generateData(int size, const string& type) {
        vector<int> data(size);
        random_device rd;
        mt19937 gen(rd());

        if (type == "random") {
            uniform_int_distribution<> dis(1, 100000);
            for (int& val : data) val = dis(gen);
        }
        else if (type == "sorted") {
            for (int i = 0; i < size; i++) data[i] = i;
        }
        else if (type == "reverse") {
            for (int i = 0; i < size; i++) data[i] = size - i;
        }
        else if (type == "nearly_sorted") {
            for (int i = 0; i < size; i++) data[i] = i;
            uniform_int_distribution<> dis(0, size - 1);
            for (int i = 0; i < size / 10; i++) {
                swap(data[dis(gen)], data[dis(gen)]);
            }
        }

        return data;
    }

    void displayResults() {
        cout << "\n📊 Performance Results:\n";
        cout << "┌─────────────────┬───────────┬─────────────┬──────────────┬───────────┐\n";
        cout << "│ Algorithm       │ Time (ms) │ Time (μs)   │ Complexity   │ Stability │\n";
        cout << "├─────────────────┼───────────┼─────────────┼──────────────┼───────────┤\n";
        
        for (const auto& result : results) {
            cout << "│ " << left << setw(15) << result.algorithm 
                 << " │ " << right << setw(9) << result.timeMs 
                 << " │ " << right << setw(11) << result.timeMicros
                 << " │ " << left << setw(12) << result.complexity
                 << " │ " << left << setw(9) << result.stability << " │\n";
        }
        cout << "└─────────────────┴───────────┴─────────────┴──────────────┴───────────┘\n";
    }

    void analyzeResults() {
        cout << "\n🎯 Performance Analysis:\n";
        
        // Find fastest and slowest
        auto fastest = *min_element(results.begin(), results.end(),
            [](const TestResult& a, const TestResult& b) {
                return a.timeMicros < b.timeMicros;
            });
        
        auto slowest = *max_element(results.begin(), results.end(),
            [](const TestResult& a, const TestResult& b) {
                return a.timeMicros < b.timeMicros;
            });

        cout << "🏆 Fastest: " << fastest.algorithm << " (" << fastest.timeMicros << " μs)\n";
        cout << "🐌 Slowest: " << slowest.algorithm << " (" << slowest.timeMicros << " μs)\n";
        
        if (slowest.timeMicros > 0) {
            double speedup = (double)slowest.timeMicros / fastest.timeMicros;
            cout << "⚡ Performance Gain: " << fixed << setprecision(2) 
                 << speedup << "x faster!\n";
        }

        cout << "\n💡 Key Insights:\n";
        cout << "• Algorithm choice is the most impactful optimization\n";
        cout << "• O(n²) algorithms become impractical for large datasets\n";
        cout << "• STL sort is highly optimized (often hybrid algorithm)\n";
        cout << "• Insertion sort can be fast for small/nearly sorted data\n";
        cout << "• Quick sort is fast on average but has O(n²) worst case\n";
        cout << "• Merge sort guarantees O(n log n) and is stable\n";
    }
};

int main() {
    SortingPerformanceAnalyzer analyzer;
    
    cout << "=== ⚡ Algorithm Performance Optimization Demo ===\n\n";
    
    // Test different scenarios
    cout << "🔬 Scenario 1: Small Random Dataset\n";
    analyzer.runComprehensiveAnalysis(1000, "random");
    
    cout << "\n" << string(60, '=') << "\n\n";
    
    cout << "🔬 Scenario 2: Large Random Dataset\n";
    analyzer.runComprehensiveAnalysis(50000, "random");
    
    cout << "\n" << string(60, '=') << "\n\n";
    
    cout << "🔬 Scenario 3: Nearly Sorted Data\n";
    analyzer.runComprehensiveAnalysis(10000, "nearly_sorted");
    
    cout << "\n🌍 Real-world Applications:\n";
    cout << "• E-commerce: Product sorting by price/rating\n";
    cout << "• Social Media: Timeline/feed organization\n";
    cout << "• Gaming: Leaderboard ranking\n";
    cout << "• Databases: Index optimization\n";
    cout << "• Financial: Transaction processing\n";
    cout << "• Healthcare: Patient record management\n";
    
    cout << "\nPress any key to continue...";
    cin.get();
    
    return 0;
}