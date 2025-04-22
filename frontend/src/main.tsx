import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import './index.css'
import { SongProvider } from './context/SongContext.tsx'
import { UserProvider } from './context/UserContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
    <SongProvider>
    <App />
    </SongProvider>
    </UserProvider>
  </StrictMode>,
)
