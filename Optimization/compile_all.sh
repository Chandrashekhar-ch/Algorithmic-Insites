#!/bin/bash

echo "===================================================="
echo "      Algorithm Performance Optimization Suite"
echo "===================================================="
echo
echo "Compiling performance analysis programs..."

# Create bin directory if it doesn't exist
mkdir -p bin

echo
echo "[1/3] Compiling Sorting Performance Analyzer..."
g++ -std=c++17 -O2 -Wall -o bin/sorting_performance sorting_performance.cpp
if [ $? -ne 0 ]; then
    echo "Error: Failed to compile sorting_performance.cpp"
    exit 1
fi

echo "[2/3] Compiling Search Performance Analyzer..."
g++ -std=c++17 -O2 -Wall -o bin/searching_performance searching_performance.cpp
if [ $? -ne 0 ]; then
    echo "Error: Failed to compile searching_performance.cpp"
    exit 1
fi

echo "[3/3] Compiling Complete Performance Suite..."
g++ -std=c++17 -O2 -Wall -o bin/complete_performance_suite complete_performance_suite.cpp
if [ $? -ne 0 ]; then
    echo "Error: Failed to compile complete_performance_suite.cpp"
    exit 1
fi

echo
echo "✅ All programs compiled successfully!"
echo
echo "Executables created in 'bin' folder:"
echo "  • bin/sorting_performance"
echo "  • bin/searching_performance"  
echo "  • bin/complete_performance_suite"
echo
echo "Ready for performance analysis and optimization demonstration!"
echo "Press any key to continue..."
read -n 1