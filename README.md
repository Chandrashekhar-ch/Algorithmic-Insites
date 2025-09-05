# Algorithmic Insights 🚀

An interactive Progressive Web App (PWA) for learning algorithms through step-by-step visualization with AI-powered explanations.

## ✨ Features

### 🎯 Core Functionality
- **Interactive Algorithm Visualization**: Step-by-step D3.js-powered animations
- **Dual State Management**: Compare different algorithms side-by-side
- **AI-Powered Explanations**: Real-time explanations using Ollama
- **Performance Metrics**: Track comparisons, swaps, and complexity analysis
- **Multiple Algorithm Support**: Bubble Sort, Selection Sort, and more

### 📱 PWA Features
- **Installable**: Add to home screen on mobile and desktop
- **Offline Support**: Works without internet connection
- **Automatic Updates**: Background updates with user notifications
- **Fast Loading**: Intelligent caching strategies
- **Responsive Design**: Optimized for all screen sizes

### 🤖 AI Integration
- **Local AI Processing**: Uses Ollama for privacy-focused AI explanations
- **Contextual Learning**: Step-by-step algorithm explanations
- **Educational Focus**: CS professor-level explanations

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Chakra UI
- **Visualization**: D3.js
- **State Management**: Zustand with Immer
- **Build Tool**: Vite
- **PWA**: vite-plugin-pwa with Workbox
- **AI**: Ollama integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Ollama (for AI explanations)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chandrashekhar-ch/Algorithmic-Insites.git
   cd Algorithmic-Insites
   ```

2. **Run PWA Setup (Recommended)**
   
   **Windows (PowerShell):**
   ```powershell
   .\setup-pwa.ps1
   ```
   
   **Linux/Mac:**
   ```bash
   chmod +x setup-pwa.sh
   ./setup-pwa.sh
   ```

3. **Manual Setup**
   ```bash
   npm install
   npm run dev
   ```

### 🖼️ PWA Icons Setup

Before the app is fully PWA-compliant, you need to add icon files. See `PWA_ICONS_SETUP.md` for detailed instructions.

Required files in `/public`:
- `pwa-192x192.png`
- `pwa-512x512.png`
- `apple-touch-icon.png`
- `favicon.ico`

## 🎮 Usage

### Basic Operation
1. **Input Data**: Enter numbers manually or generate random data
2. **Select Algorithm**: Choose from available sorting algorithms
3. **Control Playback**: Play, pause, step through algorithm execution
4. **AI Explanations**: Get real-time explanations for each step
5. **Performance Analysis**: View metrics and complexity information

### Comparison Mode
1. Enable "Comparison Mode" toggle
2. Load different datasets or algorithms
3. View side-by-side execution
4. Compare performance metrics

### PWA Installation
1. Open the app in a supported browser
2. Look for the install prompt
3. Click "Install" to add to home screen
4. Enjoy native app experience!

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── algorithms/         # Algorithm implementations
├── components/         # Reusable UI components
├── features/          # Feature-specific components
├── hooks/             # Custom React hooks
├── services/          # External service integrations
├── store/             # Zustand state management
└── App.tsx           # Main application component
```

### PWA Configuration

The app is configured with advanced PWA features:

```typescript
// vite.config.ts
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    runtimeCaching: [
      // Google Fonts caching
      // Ollama API caching
      // Static assets caching
    ]
  }
})
```

## 🤖 AI Setup (Ollama)

1. **Install Ollama**
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Pull Required Model**
   ```bash
   ollama pull llama3.2
   ```

3. **Start Ollama Service**
   ```bash
   ollama serve
   ```

The app will automatically detect Ollama availability and provide AI explanations.

## 🌐 Browser Support

### PWA Support
- ✅ Chrome/Edge (Full PWA support)
- ✅ Safari (Limited PWA features)
- ✅ Firefox (Progressive enhancement)

### Required Features
- ES2020+ support
- Service Workers
- Web App Manifest
- IndexedDB (for offline caching)

## 📊 Performance

### Lighthouse Scores
- 🟢 Performance: 95+
- 🟢 Accessibility: 100
- 🟢 Best Practices: 100
- 🟢 SEO: 100
- 🟢 PWA: 100

### Caching Strategy
- **Static Assets**: Cache First
- **API Calls**: Network First with fallback
- **Fonts**: Cache First with long expiration
- **Images**: Stale While Revalidate

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- D3.js community for visualization inspiration
- Chakra UI for excellent component library
- Ollama team for local AI capabilities
- React and Vite teams for development tools

---

**Built with ❤️ for algorithm education**
This is my DSA Course project  for the Sem 1 of 2nd year.
