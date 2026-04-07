import { useFrame, useThree } from '@react-three/fiber'
import { DevEnvironment, XRiftProvider } from '@xrift/world-components'
import type { CameraConfig, PhysicsConfig } from '@xrift/world-components'
import { StrictMode, useRef } from 'react'
import { Vector3 } from 'three'
import { createRoot } from 'react-dom/client'
import { World } from './World'
import { DEV_SPAWN_POSITION, MOON_EXHIBIT_POSITION } from './constants'
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

const DEV_LOOK_TARGET = new Vector3(...MOON_EXHIBIT_POSITION)

function DevCameraBootstrap() {
  const { camera } = useThree()
  const framesRef = useRef(0)

  useFrame(() => {
    if (framesRef.current > 6) {
      return
    }

    camera.lookAt(DEV_LOOK_TARGET)
    framesRef.current += 1
  })

  return null
}

createRoot(rootElement).render(
  <StrictMode>
    <XRiftProvider baseUrl="/">
      <DevEnvironment
        physicsConfig={physicsConfig}
        camera={cameraConfig}
        spawnPosition={DEV_SPAWN_POSITION}
      >
        <DevCameraBootstrap />
        <World />
      </DevEnvironment>
    </XRiftProvider>
  </StrictMode>,
)
