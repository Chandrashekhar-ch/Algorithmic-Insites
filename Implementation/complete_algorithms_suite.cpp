/*
 * 🚀 Complete Algorithm Implementation Suite
 * 
 * This file combines searching, sorting, and recursion algorithms
 * with real-world analogies and performance analysis.
 * 
 * Features:
 * - Interactive menu system
 * - Performance timing
 * - Educational explanations
 * - Real-world applications
 */

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <chrono>
#include <iomanip>
#include <limits>
using namespace std;
using namespace std::chrono;

// ============================================================================
// 🛒 SEARCHING ALGORITHMS
// ============================================================================

class ProductFinder {
private:
    string* products;
    int size;
    
public:
    ProductFinder(string productList[], int n) : size(n) {
        products = new string[n];
        for (int i = 0; i < n; i++) {
            products[i] = productList[i];
        }
    }
    
    ~ProductFinder() {
        delete[] products;
    }
    
    // Linear Search - O(n)
    int linearSearch(const string& key) {
        for (int i = 0; i < size; i++) {
            if (products[i] == key)
                return i;
        }
        return -1;
    }
    
    // Binary Search - O(log n) - requires sorted array
    int binarySearch(const string& key) {
        int left = 0, right = size - 1;
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
    
    void sortProducts() {
        sort(products, products + size);
    }
    
    void displayProducts() const {
        cout << "Products: ";
        for (int i = 0; i < size; i++) {
            cout << products[i];
            if (i < size - 1) cout << ", ";
        }
        cout << endl;
    }
};

// ============================================================================
// 🎓 SORTING ALGORITHMS
// ============================================================================

struct Student {
    string name;
    int marks;
};

class StudentRanking {
private:
    Student* students;
    int size;
    
public:
    StudentRanking(Student studentList[], int n) : size(n) {
        students = new Student[n];
        for (int i = 0; i < n; i++) {
            students[i] = studentList[i];
        }
    }
    
    ~StudentRanking() {
        delete[] students;
    }
    
    // Bubble Sort - O(n²)
    void bubbleSort() {
        for (int i = 0; i < size - 1; i++) {
            bool swapped = false;
            for (int j = 0; j < size - i - 1; j++) {
                if (students[j].marks > students[j + 1].marks) {
                    swap(students[j], students[j + 1]);
                    swapped = true;
                }
            }
            if (!swapped) break;
        }
    }
    
    // Insertion Sort - O(n²)
    void insertionSort() {
        for (int i = 1; i < size; i++) {
            Student key = students[i];
            int j = i - 1;
            while (j >= 0 && students[j].marks > key.marks) {
                students[j + 1] = students[j];
                j--;
            }
            students[j + 1] = key;
        }
    }
    
    // Quick Sort helpers
    int partition(int low, int high) {
        int pivot = students[high].marks;
        int i = low - 1;
        for (int j = low; j < high; j++) {
            if (students[j].marks < pivot) {
                i++;
                swap(students[i], students[j]);
            }
        }
        swap(students[i + 1], students[high]);
        return i + 1;
    }
    
    void quickSortHelper(int low, int high) {
        if (low < high) {
            int pi = partition(low, high);
            quickSortHelper(low, pi - 1);
            quickSortHelper(pi + 1, high);
        }
    }
    
    // Quick Sort - O(n log n) average
    void quickSort() {
        quickSortHelper(0, size - 1);
    }
    
    void display() const {
        cout << "┌─────────────┬───────┐\n";
        cout << "│    Name     │ Marks │\n";
        cout << "├─────────────┼───────┤\n";
        for (int i = 0; i < size; i++) {
            cout << "│ " << left << setw(11) << students[i].name 
                 << " │ " << right << setw(5) << students[i].marks << " │\n";
        }
        cout << "└─────────────┴───────┘\n";
    }
    
    void resetData(Student original[], int n) {
        for (int i = 0; i < n; i++) {
            students[i] = original[i];
        }
    }
};

// ============================================================================
// 📂 RECURSION ALGORITHMS
// ============================================================================

struct Folder {
    string name;
    vector<Folder> subFolders;
    vector<string> files;
    
    Folder(string folderName) : name(folderName) {}
    Folder(string folderName, vector<Folder> subs) : name(folderName), subFolders(subs) {}
    Folder(string folderName, vector<Folder> subs, vector<string> fileList) 
        : name(folderName), subFolders(subs), files(fileList) {}
};

class FileSystemExplorer {
private:
    int folderCount = 0;
    int fileCount = 0;
    int maxDepth = 0;
    
public:
    // Recursive folder display - O(n)
    void displayFolders(const Folder& f, int depth = 0, bool isLast = true, string prefix = "") {
        folderCount++;
        if (depth > maxDepth) maxDepth = depth;
        
        string connector = isLast ? "└── " : "├── ";
        cout << prefix << connector << "📁 " << f.name << endl;
        
        string newPrefix = prefix + (isLast ? "    " : "│   ");
        
        // Display files
        for (size_t i = 0; i < f.files.size(); i++) {
            fileCount++;
            string fileConnector = (i == f.files.size() - 1 && f.subFolders.empty()) ? "└── " : "├── ";
            cout << newPrefix << fileConnector << "📄 " << f.files[i] << endl;
        }
        
        // Recursively display subfolders
        for (size_t i = 0; i < f.subFolders.size(); i++) {
            bool isLastFolder = (i == f.subFolders.size() - 1);
            displayFolders(f.subFolders[i], depth + 1, isLastFolder, newPrefix);
        }
    }
    
    // Calculate total items recursively
    int calculateSize(const Folder& f) {
        int size = 1; // Current folder
        size += f.files.size(); // Files in current folder
        
        // Recursively add subfolder sizes
        for (const auto& sub : f.subFolders) {
            size += calculateSize(sub);
        }
        return size;
    }
    
    // Recursive search
    bool findFolder(const Folder& f, const string& target, int depth = 0) {
        if (f.name == target) {
            cout << "🎯 Found '" << target << "' at depth " << depth << endl;
            return true;
        }
        
        for (const auto& sub : f.subFolders) {
            if (findFolder(sub, target, depth + 1)) {
                return true;
            }
        }
        return false;
    }
    
    void resetCounters() {
        folderCount = fileCount = maxDepth = 0;
    }
    
    void printStatistics() const {
        cout << "\n📊 Statistics:\n";
        cout << "├── Total Folders: " << folderCount << endl;
        cout << "├── Total Files: " << fileCount << endl;
        cout << "└── Maximum Depth: " << maxDepth << endl;
    }
};

// ============================================================================
// 🎮 MAIN PROGRAM WITH INTERACTIVE MENU
// ============================================================================

void clearScreen() {
    #ifdef _WIN32
        system("cls");
    #else
        system("clear");
    #endif
}

void pauseSystem() {
    cout << "\nPress Enter to continue...";
    cin.ignore();
    cin.get();
}

void showHeader() {
    cout << "╔══════════════════════════════════════════════╗\n";
    cout << "║        🚀 Algorithm Implementation Suite      ║\n";
    cout << "║          Real-World Examples & Analysis      ║\n";
    cout << "╚══════════════════════════════════════════════╝\n\n";
}

void showMenu() {
    cout << "📋 Choose an Algorithm Category:\n\n";
    cout << "1. 🛒 Searching Algorithms (Product Finder)\n";
    cout << "2. 🎓 Sorting Algorithms (Student Ranking)\n";
    cout << "3. 📂 Recursion (File System Explorer)\n";
    cout << "4. 📊 Performance Comparison\n";
    cout << "5. ❌ Exit\n\n";
    cout << "Enter your choice (1-5): ";
}

void runSearchingDemo() {
    clearScreen();
    cout << "=== 🛒 E-Commerce Product Search System ===\n\n";
    
    string productList[] = {"Book", "Camera", "Headphones", "Laptop", "Mouse", "Phone", "Tablet", "Watch"};
    int n = 8;
    
    ProductFinder finder(productList, n);
    
    cout << "Available products:\n";
    finder.displayProducts();
    
    string searchItem;
    cout << "\nEnter product to search: ";
    cin >> searchItem;
    
    // Linear Search
    auto start = high_resolution_clock::now();
    int linear_result = finder.linearSearch(searchItem);
    auto end = high_resolution_clock::now();
    auto linear_time = duration_cast<microseconds>(end - start);
    
    cout << "\n📍 Linear Search Results:\n";
    if (linear_result != -1) {
        cout << "   ✅ Found at index " << linear_result << endl;
    } else {
        cout << "   ❌ Not Found" << endl;
    }
    cout << "   ⏱️ Time: " << linear_time.count() << " microseconds\n";
    
    // Binary Search (requires sorting)
    cout << "\n🔄 Sorting products for binary search...\n";
    finder.sortProducts();
    finder.displayProducts();
    
    start = high_resolution_clock::now();
    int binary_result = finder.binarySearch(searchItem);
    end = high_resolution_clock::now();
    auto binary_time = duration_cast<microseconds>(end - start);
    
    cout << "\n📍 Binary Search Results:\n";
    if (binary_result != -1) {
        cout << "   ✅ Found at index " << binary_result << " (sorted array)" << endl;
    } else {
        cout << "   ❌ Not Found" << endl;
    }
    cout << "   ⏱️ Time: " << binary_time.count() << " microseconds\n";
    
    cout << "\n🧩 Key Learning Points:\n";
    cout << "• Linear Search: O(n) - Simple but slower for large datasets\n";
    cout << "• Binary Search: O(log n) - Much faster but requires sorted data\n";
    cout << "• Trade-off: Sorting cost vs. search speed for multiple queries\n";
    
    pauseSystem();
}

void runSortingDemo() {
    clearScreen();
    cout << "=== 🎓 Student Ranking System ===\n\n";
    
    Student studentList[] = {
        {"Alice", 85}, {"Bob", 92}, {"Charlie", 78}, {"Diana", 96},
        {"Eve", 89}, {"Frank", 73}, {"Grace", 87}, {"Henry", 91}
    };
    int n = 8;
    
    StudentRanking ranking(studentList, n);
    
    cout << "📋 Original Student List:\n";
    ranking.display();
    
    cout << "\n🔄 Testing Sorting Algorithms:\n\n";
    
    // Bubble Sort
    cout << "1️⃣ Bubble Sort (O(n²)):\n";
    ranking.resetData(studentList, n);
    auto start = high_resolution_clock::now();
    ranking.bubbleSort();
    auto end = high_resolution_clock::now();
    auto bubble_time = duration_cast<microseconds>(end - start);
    ranking.display();
    cout << "⏱️ Time: " << bubble_time.count() << " microseconds\n\n";
    
    // Insertion Sort
    cout << "2️⃣ Insertion Sort (O(n²)):\n";
    ranking.resetData(studentList, n);
    start = high_resolution_clock::now();
    ranking.insertionSort();
    end = high_resolution_clock::now();
    auto insertion_time = duration_cast<microseconds>(end - start);
    ranking.display();
    cout << "⏱️ Time: " << insertion_time.count() << " microseconds\n\n";
    
    // Quick Sort
    cout << "3️⃣ Quick Sort (O(n log n)):\n";
    ranking.resetData(studentList, n);
    start = high_resolution_clock::now();
    ranking.quickSort();
    end = high_resolution_clock::now();
    auto quick_time = duration_cast<microseconds>(end - start);
    ranking.display();
    cout << "⏱️ Time: " << quick_time.count() << " microseconds\n\n";
    
    cout << "🧩 Algorithm Comparison:\n";
    cout << "• Bubble Sort: " << bubble_time.count() << " μs - Simple but inefficient\n";
    cout << "• Insertion Sort: " << insertion_time.count() << " μs - Good for small/nearly sorted data\n";
    cout << "• Quick Sort: " << quick_time.count() << " μs - Fast and widely used\n";
    
    pauseSystem();
}

void runRecursionDemo() {
    clearScreen();
    cout << "=== 📂 File System Explorer (Recursion) ===\n\n";
    
    FileSystemExplorer explorer;
    
    // Create folder structure
    Folder myComputer = {
        "MyComputer",
        {
            {
                "Documents", 
                {
                    {"Projects", {}, {"app.cpp", "data.txt"}},
                    {"Reports", {}, {"annual.pdf", "monthly.xlsx"}}
                },
                {"readme.md"}
            },
            {
                "Pictures", 
                {
                    {"Vacation", {}, {"beach.jpg", "sunset.png"}},
                    {"Family", {}, {"wedding.jpg", "birthday.png"}}
                },
                {}
            },
            {"Downloads", {}, {"setup.exe", "music.mp3"}}
        },
        {}
    };
    
    explorer.resetCounters();
    
    cout << "🌳 Complete Folder Structure:\n";
    auto start = high_resolution_clock::now();
    explorer.displayFolders(myComputer);
    auto end = high_resolution_clock::now();
    auto traverse_time = duration_cast<microseconds>(end - start);
    
    explorer.printStatistics();
    cout << "⏱️ Traversal Time: " << traverse_time.count() << " microseconds\n";
    
    cout << "\n🔍 Recursive Search Demo:\n";
    string searchFolder = "Projects";
    cout << "Searching for '" << searchFolder << "':\n";
    if (!explorer.findFolder(myComputer, searchFolder)) {
        cout << "❌ Folder not found\n";
    }
    
    cout << "\n🧩 Recursion Concepts:\n";
    cout << "• Base case: Folder with no subfolders\n";
    cout << "• Recursive case: Process current folder, then recurse on subfolders\n";
    cout << "• Call stack depth = folder nesting level\n";
    cout << "• Real-world usage: File systems, directory operations, tree structures\n";
    
    pauseSystem();
}

void runPerformanceComparison() {
    clearScreen();
    cout << "=== 📊 Performance Analysis Dashboard ===\n\n";
    
    cout << "🔍 Search Algorithm Complexity:\n";
    cout << "┌─────────────────┬─────────────┬─────────────┬─────────────────┐\n";
    cout << "│   Algorithm     │ Best Case   │ Average     │ Worst Case      │\n";
    cout << "├─────────────────┼─────────────┼─────────────┼─────────────────┤\n";
    cout << "│ Linear Search   │    O(1)     │    O(n)     │      O(n)       │\n";
    cout << "│ Binary Search   │    O(1)     │  O(log n)   │    O(log n)     │\n";
    cout << "└─────────────────┴─────────────┴─────────────┴─────────────────┘\n\n";
    
    cout << "📈 Sorting Algorithm Complexity:\n";
    cout << "┌─────────────────┬─────────────┬─────────────┬─────────────────┬─────────────┐\n";
    cout << "│   Algorithm     │ Best Case   │ Average     │ Worst Case      │ Space       │\n";
    cout << "├─────────────────┼─────────────┼─────────────┼─────────────────┼─────────────┤\n";
    cout << "│ Bubble Sort     │    O(n)     │   O(n²)     │      O(n²)      │    O(1)     │\n";
    cout << "│ Insertion Sort  │    O(n)     │   O(n²)     │      O(n²)      │    O(1)     │\n";
    cout << "│ Quick Sort      │ O(n log n)  │ O(n log n)  │      O(n²)      │  O(log n)   │\n";
    cout << "│ Merge Sort      │ O(n log n)  │ O(n log n)  │   O(n log n)    │    O(n)     │\n";
    cout << "└─────────────────┴─────────────┴─────────────┴─────────────────┴─────────────┘\n\n";
    
    cout << "🔄 Recursion Analysis:\n";
    cout << "• Time Complexity: Depends on problem (often O(n) for tree traversal)\n";
    cout << "• Space Complexity: O(d) where d is maximum recursion depth\n";
    cout << "• Stack overflow risk with deep recursion\n";
    cout << "• Can often be optimized with iterative solutions\n\n";
    
    cout << "💡 Real-World Usage Guidelines:\n";
    cout << "• Small datasets (n < 50): Simple algorithms (Insertion Sort)\n";
    cout << "• Medium datasets (50 < n < 1000): Efficient algorithms (Quick Sort)\n";
    cout << "• Large datasets (n > 1000): Optimize for specific use cases\n";
    cout << "• Frequent searches: Pre-sort data for Binary Search\n";
    cout << "• Memory constraints: Use in-place algorithms\n";
    
    pauseSystem();
}

int main() {
    int choice;
    
    do {
        clearScreen();
        showHeader();
        showMenu();
        
        cin >> choice;
        
        // Clear input buffer
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        
        switch (choice) {
            case 1:
                runSearchingDemo();
                break;
            case 2:
                runSortingDemo();
                break;
            case 3:
                runRecursionDemo();
                break;
            case 4:
                runPerformanceComparison();
                break;
            case 5:
                clearScreen();
                cout << "🎓 Thank you for exploring algorithms!\n";
                cout << "💡 Remember: Choose the right algorithm for your specific use case.\n";
                cout << "📚 Keep learning and happy coding! 🚀\n\n";
                break;
            default:
                cout << "❌ Invalid choice. Please try again.\n";
                pauseSystem();
        }
    } while (choice != 5);
    
    return 0;
}