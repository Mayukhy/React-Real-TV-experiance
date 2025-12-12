import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CssVarsProvider } from '@mui/joy/styles';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssVarsProvider>
      <App />
    </CssVarsProvider>
  </StrictMode>,
)