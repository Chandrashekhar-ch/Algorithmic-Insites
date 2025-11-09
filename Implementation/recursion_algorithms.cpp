/*
 * 📂 Recursion — Folder Traversal
 * 
 * Real-life analogy:
 * Recursion is like opening folders inside folders.
 * 
 * Time Complexity: O(n) where n is total number of folders
 * Space Complexity: O(d) where d is maximum depth of folder structure
 */

#include <iostream>
#include <vector>
#include <string>
#include <chrono>
using namespace std;
using namespace std::chrono;

struct Folder {
    string name;
    vector<Folder> subFolders;
    vector<string> files;
    
    // Constructor for easier folder creation
    Folder(string folderName) : name(folderName) {}
    Folder(string folderName, vector<Folder> subs) : name(folderName), subFolders(subs) {}
    Folder(string folderName, vector<Folder> subs, vector<string> fileList) 
        : name(folderName), subFolders(subs), files(fileList) {}
};

// Global counters for analysis
int folderCount = 0;
int fileCount = 0;
int maxDepth = 0;

// Recursive function to display folders with enhanced visualization
void displayFolders(const Folder& f, int depth = 0, bool isLast = true, string prefix = "") {
    // Update statistics
    folderCount++;
    if (depth > maxDepth) maxDepth = depth;
    
    // Create tree-like structure
    string connector = isLast ? "└── " : "├── ";
    cout << prefix << connector << "📁 " << f.name << endl;
    
    // Update prefix for children
    string newPrefix = prefix + (isLast ? "    " : "│   ");
    
    // Display files in current folder
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

// Calculate total size (folders + files) recursively
int calculateSize(const Folder& f) {
    int size = 1; // Count current folder
    size += f.files.size(); // Add files in current folder
    
    // Recursively add sizes of subfolders
    for (const auto& sub : f.subFolders) {
        size += calculateSize(sub); // Recursive call
    }
    return size;
}

// Find a specific folder by name (recursive search)
bool findFolder(const Folder& f, const string& target, int depth = 0) {
    // Base case: found the target folder
    if (f.name == target) {
        cout << "🎯 Found '" << target << "' at depth " << depth << endl;
        return true;
    }
    
    // Recursive case: search in subfolders
    for (const auto& sub : f.subFolders) {
        if (findFolder(sub, target, depth + 1)) {
            return true;
        }
    }
    return false;
}

// Create folder path string recursively
void getFolderPath(const Folder& f, const string& target, string currentPath = "", bool& found = *(new bool(false))) {
    string fullPath = currentPath.empty() ? f.name : currentPath + "/" + f.name;
    
    if (f.name == target) {
        cout << "📍 Full path: " << fullPath << endl;
        found = true;
        return;
    }
    
    for (const auto& sub : f.subFolders) {
        if (!found) {
            getFolderPath(sub, target, fullPath, found);
        }
    }
}

int main() {
    // Reset counters
    folderCount = fileCount = maxDepth = 0;
    
    cout << "=== 📂 File System Explorer (Recursion Demo) ===\n\n";

    // Create a realistic folder structure
    Folder myComputer = {
        "MyComputer",
        {
            {
                "Documents", 
                {
                    {"Projects", {{"WebApp", {}, {"index.html", "style.css", "script.js"}}}, {}},
                    {"Assignments", {}, {"Math_HW.pdf", "Physics_Lab.docx"}},
                    {"Reports", {}, {"Annual_Report.pdf", "Summary.txt"}}
                },
                {"Resume.pdf", "CoverLetter.docx"}
            },
            {
                "Pictures", 
                {
                    {"Vacations", {{"Beach_2023", {}, {"IMG001.jpg", "IMG002.jpg"}}}, {"sunset.jpg"}},
                    {"Family", {}, {"birthday.jpg", "wedding.jpg", "graduation.png"}},
                    {"Screenshots", {}, {"screenshot1.png", "screenshot2.png"}}
                },
                {}
            },
            {
                "Downloads", 
                {},
                {"setup.exe", "document.pdf", "music.mp3", "video.mp4"}
            },
            {
                "Programming",
                {
                    {"C++", {}, {"hello.cpp", "algorithms.cpp"}},
                    {"Python", {}, {"data_analysis.py", "web_scraper.py"}},
                    {"JavaScript", {}, {"app.js", "utils.js"}}
                },
                {"README.md"}
            }
        },
        {}
    };

    // Measure traversal time
    auto start = high_resolution_clock::now();
    
    cout << "🌳 Complete Folder Structure:\n";
    displayFolders(myComputer);
    
    auto end = high_resolution_clock::now();
    auto duration = duration_cast<microseconds>(end - start);

    cout << "\n📊 Traversal Statistics:\n";
    cout << "├── Total Folders: " << folderCount << endl;
    cout << "├── Total Files: " << fileCount << endl;
    cout << "├── Maximum Depth: " << maxDepth << endl;
    cout << "├── Total Items: " << calculateSize(myComputer) << endl;
    cout << "└── Traversal Time: " << duration.count() << " microseconds\n\n";

    // Demonstrate recursive search
    cout << "🔍 Searching for specific folders:\n";
    
    string searchTargets[] = {"Projects", "Beach_2023", "Python", "NonExistent"};
    for (const string& target : searchTargets) {
        cout << "\nSearching for '" << target << "':\n";
        if (findFolder(myComputer, target)) {
            bool found = false;
            getFolderPath(myComputer, target, "", found);
        } else {
            cout << "❌ Folder '" << target << "' not found\n";
        }
    }

    cout << "\n🧩 Recursion Concepts Demonstrated:\n";
    cout << "• 🔄 Self-similar problem: Each folder contains subfolders\n";
    cout << "• 📏 Base case: Folder with no subfolders\n";
    cout << "• 🔁 Recursive case: Process current folder, then recurse on subfolders\n";
    cout << "• 📈 Call stack depth corresponds to folder nesting level\n";
    cout << "• 🎯 Backtracking: Return from deep folders to explore siblings\n\n";

    cout << "💡 Real-world Applications:\n";
    cout << "• File system navigation (Windows Explorer, Finder)\n";
    cout << "• Directory size calculation\n";
    cout << "• File search operations\n";
    cout << "• Backup and synchronization tools\n";
    cout << "• Antivirus scanning\n";

    return 0;
}