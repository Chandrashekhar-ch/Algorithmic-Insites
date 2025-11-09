@echo off
REM Windows batch script to compile and run the algorithm insights demo
REM Make sure you have g++ installed (MinGW, MSYS2, or Visual Studio)

echo Algorithm Insights - Course Project Demo
echo ========================================

REM Check if g++ is available
g++ --version >nul 2>&1
if errorlevel 1 (
    echo Error: g++ compiler not found!
    echo Please install MinGW, MSYS2, or Visual Studio with C++ support.
    echo.
    echo Download options:
    echo - MinGW: https://www.mingw-w64.org/downloads/
    echo - MSYS2: https://www.msys2.org/
    echo - Visual Studio: https://visualstudio.microsoft.com/vs/
    pause
    exit /b 1
)

REM Compile the program
echo Compiling algorithm_insights.cpp...
g++ -std=c++17 -O2 algorithm_insights.cpp -o algorithm_insights.exe
if errorlevel 1 (
    echo Compilation failed! Check for syntax errors.
    pause
    exit /b 1
)

echo Compilation successful!
echo.

REM Run the program
echo Starting the interactive demo...
echo.
echo Tips for data collection:
echo - Test multiple input sizes: 1000, 5000, 10000, 50000
echo - Try different data distributions for each algorithm
echo - Record operation counts AND timing measurements
echo - Note when algorithms become too slow to test
echo.
pause

algorithm_insights.exe

echo.
echo Demo completed. Remember to:
echo - Document your timing measurements
echo - Compare theoretical vs actual performance  
echo - Create plots showing growth patterns
echo - Analyze why some results differ from theory
echo.
pause