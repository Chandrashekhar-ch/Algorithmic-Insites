@echo off
echo ========================================
echo       Design Folder Demos
echo    Fundamental Data Structures
echo ========================================
echo.
echo Select a program to run:
echo.
echo [1] Stack - Text Editor Undo/Redo System
echo [2] Queue - Bank Customer Service System  
echo [3] Linked List - Music Playlist Manager
echo [4] Run All Programs
echo [0] Exit
echo.
set /p choice="Enter your choice (0-4): "

if "%choice%"=="1" (
    echo.
    echo Running Stack Text Editor Demo...
    .\bin\stack_text_editor.exe
    pause
    goto menu
)

if "%choice%"=="2" (
    echo.
    echo Running Queue Bank System Demo...
    .\bin\queue_bank_system.exe
    pause
    goto menu
)

if "%choice%"=="3" (
    echo.
    echo Running Linked List Playlist Demo...
    .\bin\linked_list_playlist.exe
    pause
    goto menu
)

if "%choice%"=="4" (
    echo.
    echo Running All Programs...
    echo.
    echo === STACK TEXT EDITOR DEMO ===
    .\bin\stack_text_editor.exe
    echo.
    echo === QUEUE BANK SYSTEM DEMO ===
    .\bin\queue_bank_system.exe
    echo.
    echo === LINKED LIST PLAYLIST DEMO ===
    .\bin\linked_list_playlist.exe
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