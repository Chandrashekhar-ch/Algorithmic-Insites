/*
 * 🌳 Trees — File System Organization (Binary Search Tree)
 * 
 * Real-world analogy:
 * File managers use tree structures for organizing and searching files/folders.
 * Modern file systems and databases use B-Trees and other tree variants for
 * efficient storage and retrieval operations.
 * 
 * Time Complexity:
 * - Insert: O(log n) average, O(n) worst case (unbalanced)
 * - Search: O(log n) average, O(n) worst case (unbalanced) 
 * - Traversal: O(n)
 */

#include <iostream>
#include <string>
#include <vector>
#include <chrono>
#include <iomanip>
using namespace std;
using namespace std::chrono;

// Enhanced Node structure for Binary Search Tree
struct FileNode {
    string fileName;
    string fileType;
    int fileSize; // in KB
    FileNode* left;
    FileNode* right;
    
    FileNode(string name, string type = "file", int size = 0) 
        : fileName(name), fileType(type), fileSize(size), left(nullptr), right(nullptr) {}
};

class FileSystemBST {
private:
    FileNode* root;
    int totalNodes;
    int maxDepth;
    
    // Helper function to calculate depth
    int calculateDepth(FileNode* node) {
        if (!node) return 0;
        return 1 + max(calculateDepth(node->left), calculateDepth(node->right));
    }
    
    // Helper function for tree visualization
    void printTree(FileNode* node, string prefix = "", bool isLast = true, int depth = 0) {
        if (!node) return;
        
        if (depth > maxDepth) maxDepth = depth;
        
        cout << prefix;
        cout << (isLast ? "└── " : "├── ");
        
        // Different icons for different file types
        string icon = "📄";
        if (node->fileType == "folder") icon = "📁";
        else if (node->fileType == "image") icon = "🖼️";
        else if (node->fileType == "video") icon = "🎥";
        else if (node->fileType == "audio") icon = "🎵";
        else if (node->fileType == "document") icon = "📝";
        
        cout << icon << " " << node->fileName;
        if (node->fileSize > 0) cout << " (" << node->fileSize << " KB)";
        cout << endl;
        
        string newPrefix = prefix + (isLast ? "    " : "│   ");
        
        // Print children (left first for BST visualization)
        vector<FileNode*> children;
        if (node->left) children.push_back(node->left);
        if (node->right) children.push_back(node->right);
        
        for (size_t i = 0; i < children.size(); i++) {
            bool isLastChild = (i == children.size() - 1);
            printTree(children[i], newPrefix, isLastChild, depth + 1);
        }
    }

public:
    FileSystemBST() : root(nullptr), totalNodes(0), maxDepth(0) {}
    
    // Insert a new file into BST (Alphabetical order)
    FileNode* insert(FileNode* node, string fileName, string fileType = "file", int fileSize = 0) {
        if (!node) {
            totalNodes++;
            return new FileNode(fileName, fileType, fileSize);
        }
        
        if (fileName < node->fileName)
            node->left = insert(node->left, fileName, fileType, fileSize);
        else if (fileName > node->fileName)
            node->right = insert(node->right, fileName, fileType, fileSize);
        
        return node;
    }
    
    void insertFile(string fileName, string fileType = "file", int fileSize = 0) {
        root = insert(root, fileName, fileType, fileSize);
    }
    
    // Inorder traversal → sorted file view
    void inorderTraversal(FileNode* node) {
        if (!node) return;
        
        inorderTraversal(node->left);
        
        string icon = "📄";
        if (node->fileType == "folder") icon = "📁";
        else if (node->fileType == "image") icon = "🖼️";
        else if (node->fileType == "video") icon = "🎥";
        else if (node->fileType == "audio") icon = "🎵";
        else if (node->fileType == "document") icon = "📝";
        
        cout << icon << " " << left << setw(20) << node->fileName;
        cout << " | " << left << setw(10) << node->fileType;
        if (node->fileSize > 0) cout << " | " << right << setw(8) << node->fileSize << " KB";
        cout << endl;
        
        inorderTraversal(node->right);
    }
    
    // Search for a file with timing
    bool searchFile(FileNode* node, string key, int& comparisons) {
        comparisons++;
        
        if (!node) return false;
        if (node->fileName == key) return true;
        
        if (key < node->fileName) 
            return searchFile(node->left, key, comparisons);
        else
            return searchFile(node->right, key, comparisons);
    }
    
    // Count total files by type
    void countByType(FileNode* node, string type, int& count) {
        if (!node) return;
        
        if (node->fileType == type) count++;
        countByType(node->left, type, count);
        countByType(node->right, type, count);
    }
    
    // Calculate total storage used
    long long calculateTotalSize(FileNode* node) {
        if (!node) return 0;
        
        return node->fileSize + 
               calculateTotalSize(node->left) + 
               calculateTotalSize(node->right);
    }
    
    void displaySortedFiles() {
        cout << "\n🗂️ Files in Alphabetical Order (Inorder Traversal):\n";
        cout << "┌────────────────────┬────────────┬──────────┐\n";
        cout << "│ File Name          │ Type       │ Size     │\n";
        cout << "├────────────────────┼────────────┼──────────┤\n";
        inorderTraversal(root);
        cout << "└────────────────────┴────────────┴──────────┘\n";
    }
    
    void displayTreeStructure() {
        cout << "\n🌳 File System Tree Structure:\n";
        maxDepth = 0;
        if (root) {
            printTree(root);
        } else {
            cout << "Empty file system\n";
        }
    }
    
    void performSearch(string filename) {
        cout << "\n🔍 Searching for '" << filename << "':\n";
        
        int comparisons = 0;
        auto start = high_resolution_clock::now();
        bool found = searchFile(root, filename, comparisons);
        auto end = high_resolution_clock::now();
        auto duration = duration_cast<microseconds>(end - start);
        
        if (found) {
            cout << "✅ File found!" << endl;
        } else {
            cout << "❌ File not found" << endl;
        }
        
        cout << "📊 Search Statistics:" << endl;
        cout << "   • Comparisons made: " << comparisons << endl;
        cout << "   • Time taken: " << duration.count() << " microseconds" << endl;
        cout << "   • Tree depth: " << calculateDepth(root) << endl;
    }
    
    void showStatistics() {
        cout << "\n📈 File System Statistics:\n";
        cout << "├── Total files: " << totalNodes << endl;
        cout << "├── Tree depth: " << calculateDepth(root) << endl;
        cout << "├── Total storage: " << calculateTotalSize(root) << " KB" << endl;
        
        // Count by file type
        vector<string> types = {"folder", "document", "image", "video", "audio", "file"};
        for (const string& type : types) {
            int count = 0;
            countByType(root, type, count);
            if (count > 0) {
                cout << "├── " << type << "s: " << count << endl;
            }
        }
        cout << "└── Average search comparisons: ~" << (calculateDepth(root)) << endl;
    }
};

int main() {
    cout << "=== 🌳 File System Organization (Binary Search Tree) ===\n\n";
    
    FileSystemBST fileSystem;
    
    // Create a realistic file system
    cout << "📁 Building file system...\n";
    
    // Add various files and folders
    fileSystem.insertFile("Documents", "folder");
    fileSystem.insertFile("Photos", "folder");
    fileSystem.insertFile("Videos", "folder");
    fileSystem.insertFile("Music", "folder");
    fileSystem.insertFile("Downloads", "folder");
    
    // Add documents
    fileSystem.insertFile("Resume.pdf", "document", 245);
    fileSystem.insertFile("Report.docx", "document", 1024);
    fileSystem.insertFile("Presentation.pptx", "document", 2048);
    fileSystem.insertFile("Budget.xlsx", "document", 512);
    
    // Add media files
    fileSystem.insertFile("Vacation.jpg", "image", 3024);
    fileSystem.insertFile("Family.png", "image", 1567);
    fileSystem.insertFile("Movie.mp4", "video", 102400);
    fileSystem.insertFile("Song.mp3", "audio", 4096);
    fileSystem.insertFile("Podcast.mp3", "audio", 8192);
    
    // Add other files
    fileSystem.insertFile("Setup.exe", "file", 15360);
    fileSystem.insertFile("Config.txt", "file", 12);
    fileSystem.insertFile("Backup.zip", "file", 51200);
    
    // Display the complete file system
    fileSystem.displayTreeStructure();
    fileSystem.displaySortedFiles();
    fileSystem.showStatistics();
    
    // Demonstrate search functionality
    vector<string> searchQueries = {"Photos", "Resume.pdf", "NonExistent.txt", "Music"};
    
    for (const string& query : searchQueries) {
        fileSystem.performSearch(query);
    }
    
    cout << "\n🧩 Key Concepts Demonstrated:\n";
    cout << "• 📊 BST maintains sorted order automatically\n";
    cout << "• 🔍 Search time is O(log n) on average, O(n) worst case\n";
    cout << "• 🌳 Tree structure reflects hierarchical organization\n";
    cout << "• ⚖️ Balance affects performance significantly\n";
    cout << "• 📁 Real file systems use more advanced trees (B-trees)\n\n";
    
    cout << "💡 Real-world Applications:\n";
    cout << "• File system directories and indexing\n";
    cout << "• Database indexing systems\n";
    cout << "• Auto-complete and spell-check systems\n";
    cout << "• Priority queues and scheduling\n";
    cout << "• Expression parsing and evaluation\n";
    
    return 0;
}