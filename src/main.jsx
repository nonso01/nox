import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./components/ui-shared/user-flow.css"
import App from './App.jsx'

window._NOX_MODE_ = import.meta.env.MODE ?? "development"; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
