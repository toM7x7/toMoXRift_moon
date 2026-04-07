import { DevEnvironment, XRiftProvider } from '@xrift/world-components'
import type { CameraConfig, PhysicsConfig } from '@xrift/world-components'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { World } from './World'
import { DEV_SPAWN_POSITION } from './constants'
import xriftConfig from '../xrift.json'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

const worldConfig = (
  xriftConfig as {
    world?: {
      physics?: PhysicsConfig
      camera?: CameraConfig
    }
  }
).world

const physicsConfig: PhysicsConfig | undefined = worldConfig?.physics

const cameraConfig: CameraConfig | undefined = worldConfig?.camera

createRoot(rootElement).render(
  <StrictMode>
    <XRiftProvider baseUrl="/">
      <DevEnvironment
        physicsConfig={physicsConfig}
        camera={cameraConfig}
        spawnPosition={DEV_SPAWN_POSITION}
      >
        <World />
      </DevEnvironment>
    </XRiftProvider>
  </StrictMode>,
)
