#!/bin/bash

echo "========================================"
echo "   Advanced Data Structures Compiler"
echo "   Application Folder - Batch Build"
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

echo "Compiling Advanced Data Structure Programs..."
echo

# Compile Tree Structures
echo "[1/3] Compiling Tree Structures (BST File System)..."
if g++ $FLAGS -o bin/tree_structures tree_structures.cpp; then
    echo "     ✓ tree_structures created successfully"
else
    echo "ERROR: Failed to compile tree_structures.cpp"
    exit 1
fi

# Compile Graph Algorithms
echo "[2/3] Compiling Graph Algorithms (Social Network)..."
if g++ $FLAGS -o bin/graph_algorithms graph_algorithms.cpp; then
    echo "     ✓ graph_algorithms created successfully"
else
    echo "ERROR: Failed to compile graph_algorithms.cpp"
    exit 1
fi

# Compile Hash Tables
echo "[3/3] Compiling Hash Tables (Employee Database)..."
if g++ $FLAGS -o bin/hash_tables hash_tables.cpp; then
    echo "     ✓ hash_tables created successfully"
else
    echo "ERROR: Failed to compile hash_tables.cpp"
    exit 1
fi

echo
echo "========================================"
echo "   🎉 All Programs Compiled Successfully!"
echo "========================================"
echo
echo "Executables created in 'bin' folder:"
echo "  • tree_structures      - File System BST Demo"
echo "  • graph_algorithms     - Social Network Graph Demo"
echo "  • hash_tables          - Employee Database Hash Demo"
echo
echo "To run programs:"
echo "  ./bin/tree_structures"
echo "  ./bin/graph_algorithms"
echo "  ./bin/hash_tables"
echo
echo "For course deliverable documentation, see README.md"
echo

# Make executables executable (Linux/Mac)
chmod +x bin/*

echo "All executables are now ready to run!"