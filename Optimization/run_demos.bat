@echo off
echo ====================================================
echo      Running Algorithm Performance Demos
echo ====================================================

echo.
echo Select which performance analysis to run:
echo.
echo [1] Sorting Algorithm Performance Comparison
echo [2] Search Algorithm Optimization Analysis  
echo [3] Complete Performance Suite (All Categories)
echo [4] Run All Demos Sequentially
echo [0] Exit
echo.
set /p choice="Enter your choice (0-4): "

if "%choice%"=="1" goto sorting
if "%choice%"=="2" goto searching
if "%choice%"=="3" goto complete
if "%choice%"=="4" goto all
if "%choice%"=="0" goto exit
goto invalid

:sorting
echo.
echo 🚀 Running Sorting Performance Analysis...
echo ==========================================
if exist "bin\sorting_performance.exe" (
    bin\sorting_performance.exe
) else (
    echo Error: sorting_performance.exe not found. Please compile first using compile_all.bat
    pause
)
goto menu

:searching
echo.
echo 🔍 Running Search Performance Analysis...
echo =======================================
if exist "bin\searching_performance.exe" (
    bin\searching_performance.exe
) else (
    echo Error: searching_performance.exe not found. Please compile first using compile_all.bat
    pause
)
goto menu

:complete
echo.
echo 🎯 Running Complete Performance Suite...
echo ======================================
if exist "bin\complete_performance_suite.exe" (
    bin\complete_performance_suite.exe
) else (
    echo Error: complete_performance_suite.exe not found. Please compile first using compile_all.bat
    pause
)
goto menu

:all
echo.
echo 🌟 Running All Performance Demos...
echo =================================
echo.
echo [Demo 1/3] Sorting Performance Analysis
echo --------------------------------------
if exist "bin\sorting_performance.exe" (
    bin\sorting_performance.exe
) else (
    echo Error: sorting_performance.exe not found. Please compile first.
    pause
    goto menu
)

echo.
echo [Demo 2/3] Search Performance Analysis
echo ------------------------------------
if exist "bin\searching_performance.exe" (
    bin\searching_performance.exe
) else (
    echo Error: searching_performance.exe not found. Please compile first.
    pause
    goto menu
)

echo.
echo [Demo 3/3] Complete Performance Suite
echo -----------------------------------
if exist "bin\complete_performance_suite.exe" (
    bin\complete_performance_suite.exe
) else (
    echo Error: complete_performance_suite.exe not found. Please compile first.
    pause
    goto menu
)

echo.
echo 🎉 All performance demos completed!
pause
goto menu

:invalid
echo.
echo Invalid choice. Please enter a number between 0-4.
pause

:menu
echo.
echo.
goto start

:start
echo ====================================================
echo      Running Algorithm Performance Demos
echo ====================================================

echo.
echo Select which performance analysis to run:
echo.
echo [1] Sorting Algorithm Performance Comparison
echo [2] Search Algorithm Optimization Analysis  
echo [3] Complete Performance Suite (All Categories)
echo [4] Run All Demos Sequentially
echo [0] Exit
echo.
set /p choice="Enter your choice (0-4): "

if "%choice%"=="1" goto sorting
if "%choice%"=="2" goto searching
if "%choice%"=="3" goto complete
if "%choice%"=="4" goto all
if "%choice%"=="0" goto exit
goto invalid

:exit
echo.
echo Thank you for using Algorithm Performance Analysis Suite!
echo Great for course projects and performance optimization learning.
pause