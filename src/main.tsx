import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { configure } from '@airstate/client'
import './index.css'
import App from './App'


configure({
  appId: 'pk_airstate_nVVsF3Fm-OEO49Rankf0d',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
