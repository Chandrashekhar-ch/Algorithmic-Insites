#!/bin/bash

echo "========================================"
echo "   Fundamental Data Structures Compiler"
echo "   Design Folder - Batch Build"
echo "========================================"
echo

# Check if g++ is available
if ! command -v g++ &> /dev/null; then
    echo "Error: g++ compiler not found"
    echo "Please install g++ (GNU C++ compiler)"
    exit 1
fi

# Create output directory if it doesn't exist
mkdir -p bin

# Compilation flags
FLAGS="-std=c++17 -O2 -Wall -Wextra"

echo "Compiling Fundamental Data Structure Programs..."
echo

# Compile Stack Text Editor
echo "[1/3] Compiling Stack Text Editor (Undo/Redo System)..."
if g++ $FLAGS -o bin/stack_text_editor stack_text_editor.cpp; then
    echo "     ✓ stack_text_editor created successfully"
else
    echo "ERROR: Failed to compile stack_text_editor.cpp"
    exit 1
fi

# Compile Queue Bank System
echo "[2/3] Compiling Queue Bank System (Customer Service)..."
if g++ $FLAGS -o bin/queue_bank_system queue_bank_system.cpp; then
    echo "     ✓ queue_bank_system created successfully"
else
    echo "ERROR: Failed to compile queue_bank_system.cpp"
    exit 1
fi

# Compile Linked List Playlist
echo "[3/3] Compiling Linked List Playlist (Music Manager)..."
if g++ $FLAGS -o bin/linked_list_playlist linked_list_playlist.cpp; then
    echo "     ✓ linked_list_playlist created successfully"
else
    echo "ERROR: Failed to compile linked_list_playlist.cpp"
    exit 1
fi

echo
echo "========================================"
echo "   🎉 All Programs Compiled Successfully!"
echo "========================================"
echo
echo "Executables created in 'bin' folder:"
echo "  • stack_text_editor        - Text Editor Undo/Redo Demo"
echo "  • queue_bank_system        - Bank Service Queue Demo"
echo "  • linked_list_playlist     - Music Playlist Manager Demo"
echo
echo "To run programs:"
echo "  ./bin/stack_text_editor"
echo "  ./bin/queue_bank_system"
echo "  ./bin/linked_list_playlist"
echo
echo "For course deliverable documentation, see README.md"
echo

# Make executables executable (Linux/Mac)
chmod +x bin/*

echo "All executables are now ready to run!"