import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { player, input, ui } from './state/store'
import { elevators } from './world/dynamic'
import { train } from './systems/MonorailSystem'
import { world } from './engine/registry'
import { archCam, setCameraMode, teleport } from './systems/PlayerController'

// test / debugging hook (used by automated browser tests)
;(window as unknown as Record<string, unknown>).__campus = { player, input, ui, elevators, train, world, archCam, setCameraMode, teleport }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
