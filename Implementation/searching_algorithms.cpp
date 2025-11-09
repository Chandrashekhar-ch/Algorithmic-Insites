/*
 * 🛒 Searching Algorithms — Product Finder
 * 
 * Real-life analogy:
 * An e-commerce site searching for a product by ID or name.
 * 
 * Time Complexity:
 * - Linear Search: O(n) - worst case, O(1) - best case
 * - Binary Search: O(log n) - requires sorted array
 */

#include <iostream>
#include <string>
#include <algorithm>
#include <chrono>
using namespace std;
using namespace std::chrono;

// Linear Search - scanning each element
int linearSearch(string products[], int n, string key) {
    for (int i = 0; i < n; i++) {
        if (products[i] == key)
            return i;
    }
    return -1;
}

// Binary Search - works on sorted array
int binarySearch(string products[], int n, string key) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = (left + right) / 2;
        if (products[mid] == key)
            return mid;
        else if (products[mid] < key)
            left = mid + 1;
        else
            right = mid - 1;
    }
    return -1;
}

void displayProducts(string products[], int n) {
    cout << "Products: ";
    for (int i = 0; i < n; i++) {
        cout << products[i];
        if (i < n - 1) cout << ", ";
    }
    cout << endl;
}

int main() {
    string products[] = {"Book", "Laptop", "Mouse", "Phone", "Watch"};
    int n = 5;
    string searchItem = "Phone";

    cout << "=== E-Commerce Product Finder ===\n";
    cout << "Original product list:\n";
    displayProducts(products, n);
    cout << "\nSearching for product: " << searchItem << "\n\n";

    // Linear Search with timing
    auto start = high_resolution_clock::now();
    int index1 = linearSearch(products, n, searchItem);
    auto end = high_resolution_clock::now();
    auto duration1 = duration_cast<microseconds>(end - start);

    cout << "📍 Linear Search Results:\n";
    if (index1 != -1) {
        cout << "   ✅ Found at index " << index1 << endl;
    } else {
        cout << "   ❌ Not Found" << endl;
    }
    cout << "   ⏱️ Time: " << duration1.count() << " microseconds\n\n";

    // Binary Search (requires sorted array)
    cout << "🔄 Sorting products for binary search...\n";
    sort(products, products + n);
    cout << "Sorted product list:\n";
    displayProducts(products, n);
    
    start = high_resolution_clock::now();
    int index2 = binarySearch(products, n, searchItem);
    end = high_resolution_clock::now();
    auto duration2 = duration_cast<microseconds>(end - start);

    cout << "\n📍 Binary Search Results:\n";
    if (index2 != -1) {
        cout << "   ✅ Found at index " << index2 << " (sorted array)" << endl;
    } else {
        cout << "   ❌ Not Found" << endl;
    }
    cout << "   ⏱️ Time: " << duration2.count() << " microseconds\n\n";

    cout << "🧩 Concepts Demonstrated:\n";
    cout << "• Linear search mimics manual search in a product list\n";
    cout << "• Binary search simulates searching in a sorted database index\n";
    cout << "• Binary search is faster but requires sorted data\n";

    return 0;
}