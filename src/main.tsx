import React from 'react'
import ReactDOM from 'react-dom/client'
import { ColorModeScript } from '@chakra-ui/react'
import App from './App.tsx'
import './index.css'

// Temporarily disabled PWA service worker registration

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode="dark" />
    <App />
  </React.StrictMode>,
)
