@echo off
echo ========================================
echo    Advanced Data Structures Compiler
echo    Application Folder - Batch Build
echo ========================================
echo.

:: Check if MinGW is available
where gcc >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: GCC compiler not found in PATH
    echo Please install MinGW or add it to your system PATH
    pause
    exit /b 1
)

:: Create output directory if it doesn't exist
if not exist "bin" mkdir bin

:: Compilation flags
set FLAGS=-std=c++17 -O2 -Wall -Wextra

echo Compiling Advanced Data Structure Programs...
echo.

:: Compile Tree Structures
echo [1/3] Compiling Tree Structures (BST File System)...
gcc %FLAGS% -o bin\tree_structures.exe tree_structures.cpp
if %errorlevel% neq 0 (
    echo ERROR: Failed to compile tree_structures.cpp
    pause
    exit /b 1
)
echo      ✓ tree_structures.exe created successfully

:: Compile Graph Algorithms  
echo [2/3] Compiling Graph Algorithms (Social Network)...
gcc %FLAGS% -o bin\graph_algorithms.exe graph_algorithms.cpp
if %errorlevel% neq 0 (
    echo ERROR: Failed to compile graph_algorithms.cpp
    pause
    exit /b 1
)
echo      ✓ graph_algorithms.exe created successfully

:: Compile Hash Tables
echo [3/3] Compiling Hash Tables (Employee Database)...
gcc %FLAGS% -o bin\hash_tables.exe hash_tables.cpp
if %errorlevel% neq 0 (
    echo ERROR: Failed to compile hash_tables.cpp
    pause
    exit /b 1
)
echo      ✓ hash_tables.exe created successfully

echo.
echo ========================================
echo    🎉 All Programs Compiled Successfully!
echo ========================================
echo.
echo Executables created in 'bin' folder:
echo   • tree_structures.exe    - File System BST Demo
echo   • graph_algorithms.exe   - Social Network Graph Demo  
echo   • hash_tables.exe        - Employee Database Hash Demo
echo.
echo To run programs:
echo   bin\tree_structures.exe
echo   bin\graph_algorithms.exe
echo   bin\hash_tables.exe
echo.
echo For course deliverable documentation, see README.md
echo.
pause