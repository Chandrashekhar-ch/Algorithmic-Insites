/*
 * 🧱 Stack — Undo/Redo System in a Text Editor
 * 
 * Real-world analogy:
 * When you press Ctrl+Z (Undo) or Ctrl+Y (Redo) in MS Word or VS Code, 
 * stacks store previous and next states of your document. This demonstrates
 * the LIFO (Last-In-First-Out) principle in action.
 * 
 * Time Complexity:
 * - Push/Pop: O(1)
 * - Undo/Redo: O(1)
 * Space Complexity: O(n) where n is number of operations
 */

#include <iostream>
#include <stack>
#include <string>
#include <chrono>
#include <iomanip>
#include <vector>
using namespace std;
using namespace std::chrono;

struct EditorAction {
    string text;
    string actionType;
    string timestamp;
    
    EditorAction(string t, string type) : text(t), actionType(type) {
        auto now = high_resolution_clock::now();
        auto ms = duration_cast<milliseconds>(now.time_since_epoch());
        timestamp = to_string(ms.count() % 1000000);
    }
};

class TextEditor {
private:
    stack<EditorAction> undoStack;
    stack<EditorAction> redoStack;
    string currentText;
    int totalOperations;
    vector<string> operationHistory;

public:
    TextEditor() : currentText(""), totalOperations(0) {
        cout << "=== 🧱 Text Editor with Stack-based Undo/Redo ===\n\n";
        cout << "📝 Starting new document...\n";
    }

    void type(const string& text) {
        // Save current state before making changes
        undoStack.push(EditorAction(currentText, "TYPE"));
        currentText += text;
        totalOperations++;
        
        // Clear redo stack when new action is performed
        while (!redoStack.empty()) redoStack.pop();
        
        operationHistory.push_back("TYPED: '" + text + "'");
        
        cout << "✍️ Typed: \"" << text << "\"\n";
        showStatus();
    }

    void deleteLast(int count = 1) {
        if (currentText.length() < count) {
            cout << "❌ Cannot delete " << count << " characters (only " 
                 << currentText.length() << " available)\n";
            return;
        }
        
        undoStack.push(EditorAction(currentText, "DELETE"));
        string deleted = currentText.substr(currentText.length() - count);
        currentText = currentText.substr(0, currentText.length() - count);
        totalOperations++;
        
        while (!redoStack.empty()) redoStack.pop();
        
        operationHistory.push_back("DELETED: '" + deleted + "'");
        
        cout << "🗑️ Deleted: \"" << deleted << "\"\n";
        showStatus();
    }

    void undo() {
        if (undoStack.empty()) {
            cout << "❌ Nothing to undo!\n";
            return;
        }
        
        EditorAction lastAction = undoStack.top();
        undoStack.pop();
        
        // Save current state to redo stack
        redoStack.push(EditorAction(currentText, "UNDO_POINT"));
        
        // Restore previous state
        currentText = lastAction.text;
        totalOperations++;
        
        operationHistory.push_back("UNDO: " + lastAction.actionType);
        
        cout << "↩️ Undo performed (restored " << lastAction.actionType << ")\n";
        showStatus();
        showStackSizes();
    }

    void redo() {
        if (redoStack.empty()) {
            cout << "❌ Nothing to redo!\n";
            return;
        }
        
        EditorAction redoAction = redoStack.top();
        redoStack.pop();
        
        // Save current state to undo stack
        undoStack.push(EditorAction(currentText, "REDO_POINT"));
        
        // Restore redo state
        currentText = redoAction.text;
        totalOperations++;
        
        operationHistory.push_back("REDO: restored state");
        
        cout << "↪️ Redo performed\n";
        showStatus();
        showStackSizes();
    }

    void showStatus() {
        cout << "📄 Current Text: \"" << currentText << "\"\n";
        cout << "📊 Characters: " << currentText.length() << " | Words: " << countWords() << "\n";
        cout << "────────────────────────────────────────\n";
    }

    void showStackSizes() {
        cout << "🔢 Stack Status:\n";
        cout << "   ↩️ Undo Stack: " << undoStack.size() << " operations\n";
        cout << "   ↪️ Redo Stack: " << redoStack.size() << " operations\n";
        cout << "────────────────────────────────────────\n";
    }

    void showHistory() {
        cout << "\n📜 Operation History:\n";
        cout << "┌────┬──────────────────────────────────────────────┐\n";
        cout << "│ #  │ Operation                                    │\n";
        cout << "├────┼──────────────────────────────────────────────┤\n";
        
        for (size_t i = 0; i < operationHistory.size(); i++) {
            cout << "│ " << left << setw(2) << (i + 1) << " │ " 
                 << left << setw(48) << operationHistory[i] << "│\n";
        }
        cout << "└────┴──────────────────────────────────────────────┘\n";
    }

    void showStatistics() {
        cout << "\n📈 Editor Statistics:\n";
        cout << "├── Total Operations: " << totalOperations << endl;
        cout << "├── Current Document Length: " << currentText.length() << " characters" << endl;
        cout << "├── Word Count: " << countWords() << endl;
        cout << "├── Undo Stack Depth: " << undoStack.size() << endl;
        cout << "├── Redo Stack Depth: " << redoStack.size() << endl;
        cout << "└── Memory Usage: ~" << calculateMemoryUsage() << " bytes" << endl;
    }

    void demonstrateStackConcepts() {
        cout << "\n🎯 Stack Concepts Demonstrated:\n";
        cout << "• 📚 LIFO (Last-In-First-Out) - newest actions undone first\n";
        cout << "• 🔄 Dual Stack System - separate undo and redo stacks\n";
        cout << "• 💾 State Management - each operation saves previous state\n";
        cout << "• ⚡ O(1) Operations - constant time push/pop operations\n";
        cout << "• 🧹 Stack Clearing - redo stack cleared on new operations\n\n";
        
        cout << "🌍 Real-world Applications:\n";
        cout << "• Text Editors (MS Word, VS Code, Notepad++)\n";
        cout << "• Image Editors (Photoshop, GIMP)\n";
        cout << "• Web Browsers (Back/Forward navigation)\n";
        cout << "• Function Call Management (Call Stack)\n";
        cout << "• Expression Evaluation (Calculator apps)\n";
        cout << "• Game State Management (Save/Load states)\n";
    }

private:
    int countWords() const {
        if (currentText.empty()) return 0;
        
        int words = 0;
        bool inWord = false;
        
        for (char c : currentText) {
            if (c != ' ' && c != '\t' && c != '\n') {
                if (!inWord) {
                    words++;
                    inWord = true;
                }
            } else {
                inWord = false;
            }
        }
        
        return words;
    }

    size_t calculateMemoryUsage() const {
        size_t usage = currentText.length();
        usage += undoStack.size() * 50;  // Approximate per action
        usage += redoStack.size() * 50;
        usage += operationHistory.size() * 30;
        return usage;
    }
};

int main() {
    TextEditor editor;
    
    cout << "🚀 Starting Text Editor Demonstration:\n\n";
    
    // Simulate typing
    editor.type("Hello");
    editor.type(" World");
    editor.type("!");
    
    cout << "\n🎨 Adding more content:\n";
    editor.type(" This is");
    editor.type(" a demo");
    editor.type(" of stack-based");
    editor.type(" undo/redo system.");
    
    cout << "\n🗑️ Deleting some text:\n";
    editor.deleteLast(8);  // Delete " system."
    
    cout << "\n↩️ Performing Undo Operations:\n";
    editor.undo();  // Restore deleted text
    editor.undo();  // Undo last type
    editor.undo();  // Undo another type
    
    cout << "\n↪️ Performing Redo Operations:\n";
    editor.redo();  // Redo one operation
    editor.redo();  // Redo another
    
    cout << "\n✍️ Adding new text (this will clear redo stack):\n";
    editor.type(" NEW CONTENT");
    
    cout << "\n↩️ Trying to redo (should be empty):\n";
    editor.redo();
    
    // Show comprehensive information
    editor.showHistory();
    editor.showStatistics();
    editor.demonstrateStackConcepts();
    
    cout << "\nPress any key to continue...";
    cin.get();
    
    return 0;
}