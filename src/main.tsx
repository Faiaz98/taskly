import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { configure } from '@airstate/client'
import './index.css'
import App from './App'

configure({
  appId: import.meta.env.VITE_AIRSTATE_APP_ID,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
