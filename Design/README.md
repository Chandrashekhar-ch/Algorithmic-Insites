# 🏗️ Design Folder - Fundamental Data Structures

This folder contains implementations of fundamental data structures with real-world applications, designed for understanding core computer science concepts and their practical usage.

## Programs Overview

### 🧱 Stack - Text Editor Undo/Redo System (`stack_text_editor.cpp`)
**Real-world Context**: Text Editor with Stack-based Undo/Redo functionality
- **Purpose**: Demonstrates LIFO (Last-In-First-Out) principle through document editing
- **Features**: 
  - Dual stack system (undo and redo stacks)
  - Text typing and deletion operations
  - State management with operation history
  - Performance timing and memory usage analysis
  - Comprehensive operation logging
  - Word count and document statistics

### 🚗 Queue - Bank Customer Service System (`queue_bank_system.cpp`)
**Real-world Context**: Multi-priority Banking Service Queue Management
- **Purpose**: Shows FIFO (First-In-First-Out) principle with priority queue implementation
- **Features**:
  - Multi-tier service queues (VIP, Premium, Regular)
  - Token-based customer management system
  - Service time simulation and estimation
  - Comprehensive queue status visualization
  - Service activity logging and statistics
  - Real-time queue size monitoring

### 🧬 Linked List - Music Playlist Manager (`linked_list_playlist.cpp`)
**Real-world Context**: Music Streaming Service Playlist Management
- **Purpose**: Demonstrates doubly linked list with bidirectional navigation
- **Features**:
  - Song management (add, remove, search)
  - Bidirectional navigation (next/previous)
  - Playlist controls (play, pause, resume, jump)
  - Detailed song metadata (artist, album, duration, genre)
  - Play history tracking and statistics
  - Memory management and performance analysis

## Educational Value

Each program includes:
- ✅ **Time Complexity Analysis**: Big O notation explanations for all operations
- ⚡ **Performance Monitoring**: Operation timing and efficiency metrics  
- 📊 **Statistical Analysis**: Memory usage, operation counts, and performance insights
- 🎯 **Real-world Applications**: Practical use cases and industry examples
- 🧪 **Interactive Demonstrations**: Step-by-step operation visualization
- 📚 **Conceptual Explanations**: Data structure principles and theory

## Compilation Instructions

### Individual Programs
```bash
# Windows (MinGW)
g++ -std=c++17 -O2 -o stack_text_editor.exe stack_text_editor.cpp
g++ -std=c++17 -O2 -o queue_bank_system.exe queue_bank_system.cpp
g++ -std=c++17 -O2 -o linked_list_playlist.exe linked_list_playlist.cpp

# Linux/Mac
g++ -std=c++17 -O2 -o stack_text_editor stack_text_editor.cpp
g++ -std=c++17 -O2 -o queue_bank_system queue_bank_system.cpp
g++ -std=c++17 -O2 -o linked_list_playlist linked_list_playlist.cpp
```

### Batch Compilation
Use the provided compilation scripts:
- **Windows**: `compile_all.bat`
- **Linux/Mac**: `compile_all.sh`

## Course Integration

### Assignment Ideas
1. **Data Structure Comparison**: Analyze when to use each structure for specific scenarios
2. **Performance Analysis**: Measure and report operation complexities under different data sizes
3. **Memory Management**: Implement custom memory allocation strategies
4. **Algorithm Extensions**: Add new features like shuffle (playlist), priority handling (queue), or advanced undo (stack)

### Learning Objectives
- Understanding fundamental data structures (Stack, Queue, Linked List)
- Algorithm complexity analysis (Big O notation)
- Memory management and pointer manipulation
- Real-world application of theoretical concepts
- Object-oriented design principles and encapsulation

## Data Structure Comparison

| Feature | Stack | Queue | Linked List |
|---------|-------|-------|-------------|
| **Primary Principle** | LIFO (Last-In-First-Out) | FIFO (First-In-First-Out) | Dynamic Navigation |
| **Access Pattern** | Top element only | Front/rear elements | Any element via traversal |
| **Insert Complexity** | O(1) | O(1) | O(1) at ends, O(n) middle |
| **Delete Complexity** | O(1) | O(1) | O(1) if node known |
| **Search Complexity** | O(n) | O(n) | O(n) |
| **Memory Usage** | O(n) | O(n) | O(n) + pointer overhead |
| **Real-world Context** | Undo/Redo Systems | Service Queues | Navigation Systems |
| **Best Use Case** | Function calls, Expression evaluation | Task scheduling, Buffer management | Dynamic lists, Bidirectional navigation |

## Advanced Topics Covered

### Stack Implementation
- Dual stack architecture for undo/redo functionality
- State management and operation history tracking
- Memory-efficient text manipulation
- Performance analysis of stack operations

### Queue Implementation  
- Multi-priority queue system design
- Token-based customer management
- Service time estimation and optimization
- Queue visualization and status monitoring

### Linked List Implementation
- Doubly linked list with bidirectional pointers
- Dynamic memory allocation and deallocation
- Efficient insertion and deletion operations
- Playlist navigation and control systems

## Extension Opportunities

Students can extend these programs by:
1. **Stack**: Implement syntax checking, mathematical expression evaluation
2. **Queue**: Add circular queues, priority scheduling algorithms
3. **Linked List**: Implement circular lists, skip lists, or XOR linked lists
4. **Cross-structure**: Create hybrid systems combining multiple data structures

## Performance Benchmarking

All programs include comprehensive performance analysis:
- Operation-level timing (microseconds precision)
- Memory usage calculations and optimization
- Statistical analysis of data structure efficiency
- Comparative analysis between different approaches

This makes them ideal for:
- Algorithm analysis assignments and projects
- Performance comparison studies
- Big O notation verification and demonstration
- Real-world application case studies

## Key Concepts Demonstrated

### Stack Concepts
- LIFO principle and its applications
- State management in interactive systems
- Dual stack systems for undo/redo functionality
- Memory-efficient operation storage

### Queue Concepts  
- FIFO principle and fairness in service systems
- Priority queue implementation and management
- Multi-tier service level handling
- Token-based identification systems

### Linked List Concepts
- Dynamic memory allocation and pointer manipulation
- Bidirectional navigation using prev/next pointers
- Efficient insertion and deletion operations
- Memory management in dynamic data structures

Each program demonstrates not only the technical implementation but also the practical reasoning behind choosing specific data structures for real-world problems.