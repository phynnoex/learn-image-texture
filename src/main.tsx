import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import FragMentNoise from './fragmentNoise.tsx'
import { Lenis } from 'lenis/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Lenis root options={{ smoothWheel: true }}>
      <FragMentNoise />
    </Lenis>
  </StrictMode>,
)
