import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { SpawnPoint } from '@xrift/world-components'
import { EquatorDeck } from './components/EquatorDeck'
import { MoonExhibit } from './components/MoonExhibit'
import { Starfield } from './components/Starfield'
import {
  PHYSICS_GROUND_HEIGHT,
  PHYSICS_GROUND_SIZE,
  WORLD_COLORS,
  WORLD_SPAWN_POINT,
} from './constants'

export interface WorldProps {
  position?: [number, number, number]
  scale?: number
}

export function World({
  position = [0, 0, 0],
  scale = 1,
}: WorldProps) {
  return (
    <group position={position} scale={scale}>
      <color attach="background" args={[WORLD_COLORS.background]} />

      <Starfield worldPosition={position} worldScale={scale} />

      <ambientLight intensity={0.22} />
      <hemisphereLight
        intensity={0.42}
        color={WORLD_COLORS.sun}
        groundColor={WORLD_COLORS.horizon}
      />
      <directionalLight
        position={[18, 26, 12]}
        intensity={1.6}
        color={WORLD_COLORS.sun}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={180}
        shadow-camera-left={-42}
        shadow-camera-right={42}
        shadow-camera-top={42}
        shadow-camera-bottom={-42}
      />
      <directionalLight
        position={[-24, 12, -18]}
        intensity={0.42}
        color={WORLD_COLORS.rim}
      />

      <SpawnPoint position={WORLD_SPAWN_POINT} yaw={0} />

      <RigidBody type="fixed" colliders={false} friction={1} restitution={0}>
        <CuboidCollider
          args={[
            PHYSICS_GROUND_SIZE / 2,
            PHYSICS_GROUND_HEIGHT / 2,
            PHYSICS_GROUND_SIZE / 2,
          ]}
          position={[0, -PHYSICS_GROUND_HEIGHT / 2, 0]}
        />
      </RigidBody>

      <EquatorDeck />
      <MoonExhibit
        showObservationRing={false}
        floatHeight={0}
        floatAmplitude={0}
      />
    </group>
  )
}
