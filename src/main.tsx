import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FragMentNoise from './fragmentNoise.tsx'
import { Lenis } from 'lenis/react'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <Lenis root options={{ smoothWheel: true }}>
        <FragMentNoise />
      </Lenis>
    </StrictMode>
  </BrowserRouter>
)
