import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexAuthProvider } from '@convex-dev/auth/react'
import { HelmetProvider } from 'react-helmet-async'
import { convex } from './lib/convex'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ConvexAuthProvider client={convex}>
        <App />
      </ConvexAuthProvider>
    </HelmetProvider>
  </StrictMode>,
)
