@echo off
echo ========================================
echo    Fundamental Data Structures Compiler
echo    Design Folder - Batch Build
echo ========================================
echo.

:: Check if g++ is available
where g++ >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: g++ compiler not found in PATH
    echo Please install MinGW or add it to your system PATH
    pause
    exit /b 1
)

:: Create output directory if it doesn't exist
if not exist "bin" mkdir bin

:: Compilation flags
set FLAGS=-std=c++17 -O2 -Wall -Wextra

echo Compiling Fundamental Data Structure Programs...
echo.

:: Compile Stack Text Editor
echo [1/3] Compiling Stack Text Editor (Undo/Redo System)...
g++ %FLAGS% -o bin\stack_text_editor.exe stack_text_editor.cpp
if %errorlevel% neq 0 (
    echo ERROR: Failed to compile stack_text_editor.cpp
    pause
    exit /b 1
)
echo      ✓ stack_text_editor.exe created successfully

:: Compile Queue Bank System  
echo [2/3] Compiling Queue Bank System (Customer Service)...
g++ %FLAGS% -o bin\queue_bank_system.exe queue_bank_system.cpp
if %errorlevel% neq 0 (
    echo ERROR: Failed to compile queue_bank_system.cpp
    pause
    exit /b 1
)
echo      ✓ queue_bank_system.exe created successfully

:: Compile Linked List Playlist
echo [3/3] Compiling Linked List Playlist (Music Manager)...
g++ %FLAGS% -o bin\linked_list_playlist.exe linked_list_playlist.cpp
if %errorlevel% neq 0 (
    echo ERROR: Failed to compile linked_list_playlist.cpp
    pause
    exit /b 1
)
echo      ✓ linked_list_playlist.exe created successfully

echo.
echo ========================================
echo    🎉 All Programs Compiled Successfully!
echo ========================================
echo.
echo Executables created in 'bin' folder:
echo   • stack_text_editor.exe      - Text Editor Undo/Redo Demo
echo   • queue_bank_system.exe      - Bank Service Queue Demo  
echo   • linked_list_playlist.exe   - Music Playlist Manager Demo
echo.
echo To run programs:
echo   bin\stack_text_editor.exe
echo   bin\queue_bank_system.exe
echo   bin\linked_list_playlist.exe
echo.
echo For course deliverable documentation, see README.md
echo.
pause