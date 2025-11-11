import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { configure } from '@airstate/client'
import './index.css'
import App from './App'

try {
  configure({
    appId: import.meta.env.VITE_AIRSTATE_APP_ID,
  })
} catch (error) {
  console.error('Failed to configure AirState:', error)
  console.warn('App will continue but real-time features may not work')
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
