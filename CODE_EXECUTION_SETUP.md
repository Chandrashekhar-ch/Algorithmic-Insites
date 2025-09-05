# Code Execution Setup Guide

This document explains how to configure multi-language code execution for the Algorithmic Insights platform.

## Supported Languages & Execution Methods

### ✅ **JavaScript** (Native)
- **Method**: Browser-based sandbox execution
- **Setup**: No setup required
- **Features**: Full algorithm visualization with step tracking
- **Security**: Sandboxed execution environment

### ✅ **Python** (Pyodide)
- **Method**: WebAssembly-based Python runtime
- **Setup**: Automatic (loads Pyodide from CDN)
- **Features**: Real Python execution in browser
- **Download**: ~3MB initial download
- **Note**: First execution may be slower due to initialization

### 🌐 **C++** (Online Compilation)
- **Method**: JDoodle API compilation service
- **Setup Required**: 
  1. Register at [JDoodle.com](https://www.jdoodle.com/compiler-api)
  2. Get free API credentials (200 executions/day)
  3. Update `codeExecutionService.ts` with your credentials:
     ```typescript
     clientId: 'your-jdoodle-client-id',
     clientSecret: 'your-jdoodle-client-secret'
     ```

### 🌐 **Java** (Online Compilation)
- **Method**: JDoodle API compilation service
- **Setup**: Same as C++ (shared API key)
- **Features**: Full Java compilation and execution

### 🚧 **Rust** (Coming Soon)
- **Method**: WebAssembly compilation
- **Status**: Planned implementation
- **Alternative**: Use online compilation service

### 🚧 **Go** (Coming Soon)
- **Method**: Online compilation service
- **Status**: Planned implementation

## Alternative Compilation Services

If you prefer different services, you can modify `codeExecutionService.ts` to use:

### Judge0 API
- **Website**: [judge0.com](https://judge0.com)
- **Pros**: More languages, faster execution
- **Cons**: Requires subscription for high usage

### Sphere Engine
- **Website**: [sphere-engine.com](https://sphere-engine.com)
- **Pros**: Enterprise-grade, very reliable
- **Cons**: Higher cost

### CodeX API
- **Website**: [codex.jaagrav.in](https://codex.jaagrav.in)
- **Pros**: Free tier available
- **Cons**: Rate limited

## Local Development Setup

For development environments, you can set up local compilers:

### Docker-based Execution (Recommended)
```bash
# Create a secure Docker container for code execution
docker run --rm -v /path/to/code:/code gcc:latest gcc /code/algorithm.cpp -o /code/output
```

### Native Compilers
- **C++**: Install GCC or Clang
- **Java**: Install OpenJDK
- **Rust**: Install via rustup.rs
- **Go**: Install from golang.org

## Security Considerations

### Browser Execution (JS/Python)
- ✅ Sandboxed environment
- ✅ No file system access
- ✅ No network access
- ✅ Limited memory/CPU usage

### Remote Compilation Services
- ⚠️ Code is sent to external servers
- ⚠️ Execution happens remotely
- ✅ Results returned safely
- ✅ No local system access

### Local Execution (if implemented)
- ⚠️ Requires careful sandboxing
- ⚠️ Should use containers/chroot
- ⚠️ Needs resource limits

## Configuration

Update the configuration in `src/services/codeExecutionService.ts`:

```typescript
// JDoodle Configuration
const JDOODLE_CONFIG = {
  clientId: process.env.REACT_APP_JDOODLE_CLIENT_ID || 'your-client-id',
  clientSecret: process.env.REACT_APP_JDOODLE_CLIENT_SECRET || 'your-client-secret',
  baseUrl: 'https://api.jdoodle.com/v1/execute'
}

// Environment variables (create .env file)
REACT_APP_JDOODLE_CLIENT_ID=your_actual_client_id
REACT_APP_JDOODLE_CLIENT_SECRET=your_actual_client_secret
```

## Usage Examples

### JavaScript (Native)
```javascript
function bubbleSort(arr) {
  // Your algorithm here
  return steps;
}
```

### Python (Pyodide)
```python
def bubble_sort(arr):
    # Your algorithm here
    return steps
```

### C++ (Remote)
```cpp
#include <iostream>
#include <vector>

std::vector<AlgorithmStep> bubbleSort(std::vector<int>& arr) {
    // Your algorithm here
    return steps;
}
```

## Troubleshooting

### Python Not Loading
- Check browser console for Pyodide errors
- Ensure stable internet connection
- Try refreshing the page

### C++/Java Compilation Errors
- Verify API credentials in browser dev tools
- Check API quota limits
- Ensure code syntax is correct

### Performance Issues
- JavaScript: Always fastest (native execution)
- Python: Slower first run, then fast
- C++/Java: Network latency dependent

## Future Enhancements

1. **WebAssembly Compilation**: Direct browser compilation for C++/Rust
2. **Language Server Protocol**: Better code editing experience
3. **Debugging Support**: Step-through debugging
4. **Performance Analytics**: Execution time tracking
5. **Code Sharing**: Save and share algorithms

---

For questions or issues, please check the project documentation or create an issue on GitHub.
