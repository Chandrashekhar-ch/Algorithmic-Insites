@echo off
echo ====================================================
echo      Algorithm Performance Optimization Suite
echo ====================================================
echo.
echo Compiling performance analysis programs...

REM Create bin directory if it doesn't exist
if not exist "bin" mkdir bin

echo.
echo [1/3] Compiling Sorting Performance Analyzer...
g++ -std=c++17 -O2 -Wall -o bin/sorting_performance.exe sorting_performance.cpp
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to compile sorting_performance.cpp
    pause
    exit /b 1
)

echo [2/3] Compiling Search Performance Analyzer...
g++ -std=c++17 -O2 -Wall -o bin/searching_performance.exe searching_performance.cpp
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to compile searching_performance.cpp
    pause
    exit /b 1
)

echo [3/3] Compiling Complete Performance Suite...
g++ -std=c++17 -O2 -Wall -o bin/complete_performance_suite.exe complete_performance_suite.cpp
if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to compile complete_performance_suite.cpp
    pause
    exit /b 1
)

echo.
echo ✅ All programs compiled successfully!
echo.
echo Executables created in 'bin' folder:
echo   • bin/sorting_performance.exe
echo   • bin/searching_performance.exe  
echo   • bin/complete_performance_suite.exe
echo.
echo Ready for performance analysis and optimization demonstration!
pause