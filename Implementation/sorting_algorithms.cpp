/*
 * 🎓 Sorting Algorithms — Student Marks
 * 
 * Real-life analogy:
 * Sorting student marks from lowest to highest for result ranking.
 * 
 * Time Complexity:
 * - Bubble Sort: O(n²) - worst/average case, O(n) - best case
 * - Insertion Sort: O(n²) - worst/average case, O(n) - best case  
 * - Quick Sort: O(n log n) - average case, O(n²) - worst case
 */

#include <iostream>
#include <string>
#include <chrono>
#include <iomanip>
using namespace std;
using namespace std::chrono;

struct Student {
    string name;
    int marks;
};

// Bubble Sort - like bubbles rising to surface
void bubbleSort(Student arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j].marks > arr[j + 1].marks) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break; // Optimization: stop if no swaps
    }
}

// Insertion Sort - like sorting cards in hand
void insertionSort(Student arr[], int n) {
    for (int i = 1; i < n; i++) {
        Student key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j].marks > key.marks) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

// Quick Sort helper functions
int partition(Student arr[], int low, int high) {
    int pivot = arr[high].marks;
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j].marks < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(Student arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

// Merge Sort helper functions
void merge(Student arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    Student L[n1], R[n2];
    
    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];
    
    int i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
        if (L[i].marks <= R[j].marks) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    while (i < n1) { arr[k] = L[i]; i++; k++; }
    while (j < n2) { arr[k] = R[j]; j++; k++; }
}

void mergeSort(Student arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSort(arr, left, mid);
        mergeSort(arr, mid + 1, right);
        merge(arr, left, mid, right);
    }
}

void display(Student arr[], int n, string title) {
    cout << title << "\n";
    cout << "┌─────────────┬───────┐\n";
    cout << "│    Name     │ Marks │\n";
    cout << "├─────────────┼───────┤\n";
    for (int i = 0; i < n; i++) {
        cout << "│ " << left << setw(11) << arr[i].name 
             << " │ " << right << setw(5) << arr[i].marks << " │\n";
    }
    cout << "└─────────────┴───────┘\n\n";
}

void copyArray(Student source[], Student dest[], int n) {
    for (int i = 0; i < n; i++) {
        dest[i] = source[i];
    }
}

void timeSort(Student original[], int n, string sortName, void (*sortFunc)(Student[], int)) {
    Student temp[n];
    copyArray(original, temp, n);
    
    auto start = high_resolution_clock::now();
    sortFunc(temp, n);
    auto end = high_resolution_clock::now();
    auto duration = duration_cast<microseconds>(end - start);
    
    display(temp, n, "📊 After " + sortName + ":");
    cout << "⏱️  " << sortName << " Time: " << duration.count() << " microseconds\n\n";
}

void timeSortQuick(Student original[], int n) {
    Student temp[n];
    copyArray(original, temp, n);
    
    auto start = high_resolution_clock::now();
    quickSort(temp, 0, n - 1);
    auto end = high_resolution_clock::now();
    auto duration = duration_cast<microseconds>(end - start);
    
    display(temp, n, "📊 After Quick Sort:");
    cout << "⏱️  Quick Sort Time: " << duration.count() << " microseconds\n\n";
}

void timeSortMerge(Student original[], int n) {
    Student temp[n];
    copyArray(original, temp, n);
    
    auto start = high_resolution_clock::now();
    mergeSort(temp, 0, n - 1);
    auto end = high_resolution_clock::now();
    auto duration = duration_cast<microseconds>(end - start);
    
    display(temp, n, "📊 After Merge Sort:");
    cout << "⏱️  Merge Sort Time: " << duration.count() << " microseconds\n\n";
}

int main() {
    Student students[] = {
        {"Amit", 72}, {"Sneha", 89}, {"Raj", 65}, 
        {"Priya", 92}, {"Karan", 80}, {"Anita", 78},
        {"Rohit", 85}, {"Meera", 91}
    };
    int n = 8;

    cout << "=== 🎓 Student Marks Ranking System ===\n\n";
    display(students, n, "📋 Original Student List:");

    cout << "🔄 Testing Different Sorting Algorithms:\n\n";

    // Test Bubble Sort
    timeSort(students, n, "Bubble Sort", bubbleSort);

    // Test Insertion Sort  
    timeSort(students, n, "Insertion Sort", insertionSort);

    // Test Quick Sort
    timeSortQuick(students, n);

    // Test Merge Sort
    timeSortMerge(students, n);

    cout << "🧩 Algorithm Analysis:\n";
    cout << "• Bubble Sort: O(n²) - Simple but inefficient for large datasets\n";
    cout << "• Insertion Sort: O(n²) - Good for small or nearly sorted data\n";
    cout << "• Quick Sort: O(n log n) avg - Fast, widely used, in-place\n";
    cout << "• Merge Sort: O(n log n) - Stable, predictable performance\n\n";
    
    cout << "💡 Real-world Usage:\n";
    cout << "• Academic ranking systems\n";
    cout << "• Leaderboard generation in gaming\n";
    cout << "• Employee performance evaluation\n";
    cout << "• Product sorting by price/rating\n";

    return 0;
}