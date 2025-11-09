@echo off
echo ======================================
echo  🚀 Algorithm Suite Compiler
echo ======================================
echo.

cd /d "%~dp0"

echo 🔨 Compiling individual algorithm files...
echo.

echo 1. Compiling Searching Algorithms...
g++ -std=c++17 -O2 -o searching_algorithms.exe searching_algorithms.cpp
if %errorlevel% equ 0 (
    echo    ✅ searching_algorithms.exe created successfully
) else (
    echo    ❌ Error compiling searching_algorithms.cpp
)

echo.
echo 2. Compiling Sorting Algorithms...
g++ -std=c++17 -O2 -o sorting_algorithms.exe sorting_algorithms.cpp
if %errorlevel% equ 0 (
    echo    ✅ sorting_algorithms.exe created successfully
) else (
    echo    ❌ Error compiling sorting_algorithms.cpp
)

echo.
echo 3. Compiling Recursion Algorithms...
g++ -std=c++17 -O2 -o recursion_algorithms.exe recursion_algorithms.cpp
if %errorlevel% equ 0 (
    echo    ✅ recursion_algorithms.exe created successfully
) else (
    echo    ❌ Error compiling recursion_algorithms.cpp
)

echo.
echo 4. Compiling Complete Algorithm Suite...
g++ -std=c++17 -O2 -o complete_algorithms_suite.exe complete_algorithms_suite.cpp
if %errorlevel% equ 0 (
    echo    ✅ complete_algorithms_suite.exe created successfully
) else (
    echo    ❌ Error compiling complete_algorithms_suite.cpp
)

echo.
echo ======================================
echo  📋 Compilation Summary
echo ======================================

if exist searching_algorithms.exe echo ✅ Searching Algorithms Ready
if exist sorting_algorithms.exe echo ✅ Sorting Algorithms Ready  
if exist recursion_algorithms.exe echo ✅ Recursion Algorithms Ready
if exist complete_algorithms_suite.exe echo ✅ Complete Suite Ready

echo.
echo 🎮 To run programs:
echo    .\searching_algorithms.exe
echo    .\sorting_algorithms.exe
echo    .\recursion_algorithms.exe
echo    .\complete_algorithms_suite.exe
echo.

pause