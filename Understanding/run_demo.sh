#!/bin/bash
# Shell script to compile and run the algorithm insights demo
# Works on Linux, macOS, and Windows with WSL/Git Bash

echo "Algorithm Insights - Course Project Demo"
echo "========================================"

# Check if g++ is available
if ! command -v g++ &> /dev/null; then
    echo "Error: g++ compiler not found!"
    echo "Please install a C++ compiler:"
    echo "  Ubuntu/Debian: sudo apt install g++"
    echo "  macOS: xcode-select --install"
    echo "  Fedora: sudo dnf install gcc-c++"
    echo "  Arch: sudo pacman -S gcc"
    exit 1
fi

# Compile the program
echo "Compiling algorithm_insights.cpp..."
g++ -std=c++17 -O2 algorithm_insights.cpp -o algorithm_insights
if [ $? -ne 0 ]; then
    echo "Compilation failed! Check for syntax errors."
    exit 1
fi

echo "Compilation successful!"
echo ""

# Make executable (for Unix systems)
chmod +x algorithm_insights

# Run the program
echo "Starting the interactive demo..."
echo ""
echo "Tips for data collection:"
echo "- Test multiple input sizes: 1000, 5000, 10000, 50000"
echo "- Try different data distributions for each algorithm"
echo "- Record operation counts AND timing measurements"
echo "- Note when algorithms become too slow to test"
echo ""
read -p "Press Enter to continue..."

./algorithm_insights

echo ""
echo "Demo completed. Remember to:"
echo "- Document your timing measurements"
echo "- Compare theoretical vs actual performance"
echo "- Create plots showing growth patterns"
echo "- Analyze why some results differ from theory"
echo ""
read -p "Press Enter to exit..."