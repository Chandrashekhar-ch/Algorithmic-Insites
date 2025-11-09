@echo off
echo ========================================
echo       Application Folder Demos
echo    Advanced Data Structures Suite
echo ========================================
echo.
echo Select a program to run:
echo.
echo [1] Tree Structures - File System BST
echo [2] Graph Algorithms - Social Network  
echo [3] Hash Tables - Employee Database
echo [4] Run All Programs
echo [0] Exit
echo.
set /p choice="Enter your choice (0-4): "

if "%choice%"=="1" (
    echo.
    echo Running Tree Structures Demo...
    .\tree_structures.exe
    pause
    goto menu
)

if "%choice%"=="2" (
    echo.
    echo Running Graph Algorithms Demo...
    .\graph_algorithms.exe
    pause
    goto menu
)

if "%choice%"=="3" (
    echo.
    echo Running Hash Tables Demo...
    .\hash_tables.exe
    pause
    goto menu
)

if "%choice%"=="4" (
    echo.
    echo Running All Programs...
    echo.
    echo === TREE STRUCTURES DEMO ===
    .\tree_structures.exe
    echo.
    echo === GRAPH ALGORITHMS DEMO ===
    .\graph_algorithms.exe
    echo.
    echo === HASH TABLES DEMO ===
    .\hash_tables.exe
    pause
    goto menu
)

if "%choice%"=="0" (
    echo Goodbye!
    exit /b 0
)

echo Invalid choice. Please try again.
pause
:menu
cls
goto start

:start
goto :eof