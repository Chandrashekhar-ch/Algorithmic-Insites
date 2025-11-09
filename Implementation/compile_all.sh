#!/bin/bash

echo "======================================"
echo "  🚀 Algorithm Suite Compiler"
echo "======================================"
echo

cd "$(dirname "$0")"

echo "🔨 Compiling individual algorithm files..."
echo

echo "1. Compiling Searching Algorithms..."
if g++ -std=c++17 -O2 -o searching_algorithms searching_algorithms.cpp; then
    echo "    ✅ searching_algorithms executable created successfully"
else
    echo "    ❌ Error compiling searching_algorithms.cpp"
fi

echo
echo "2. Compiling Sorting Algorithms..."
if g++ -std=c++17 -O2 -o sorting_algorithms sorting_algorithms.cpp; then
    echo "    ✅ sorting_algorithms executable created successfully"
else
    echo "    ❌ Error compiling sorting_algorithms.cpp"
fi

echo
echo "3. Compiling Recursion Algorithms..."
if g++ -std=c++17 -O2 -o recursion_algorithms recursion_algorithms.cpp; then
    echo "    ✅ recursion_algorithms executable created successfully"
else
    echo "    ❌ Error compiling recursion_algorithms.cpp"
fi

echo
echo "4. Compiling Complete Algorithm Suite..."
if g++ -std=c++17 -O2 -o complete_algorithms_suite complete_algorithms_suite.cpp; then
    echo "    ✅ complete_algorithms_suite executable created successfully"
else
    echo "    ❌ Error compiling complete_algorithms_suite.cpp"
fi

echo
echo "======================================"
echo "  📋 Compilation Summary"
echo "======================================"

[ -f searching_algorithms ] && echo "✅ Searching Algorithms Ready"
[ -f sorting_algorithms ] && echo "✅ Sorting Algorithms Ready"  
[ -f recursion_algorithms ] && echo "✅ Recursion Algorithms Ready"
[ -f complete_algorithms_suite ] && echo "✅ Complete Suite Ready"

echo
echo "🎮 To run programs:"
echo "   ./searching_algorithms"
echo "   ./sorting_algorithms"
echo "   ./recursion_algorithms"
echo "   ./complete_algorithms_suite"
echo

# Make executables executable
chmod +x searching_algorithms sorting_algorithms recursion_algorithms complete_algorithms_suite 2>/dev/null

echo "📝 Note: Executables have been made executable with chmod +x"
echo