import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier'
import { SpawnPoint } from '@xrift/world-components'
import { MoonRig } from './components/MoonRig'
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

      <ambientLight intensity={0.2} />
      <hemisphereLight
        intensity={0.3}
        color={WORLD_COLORS.sun}
        groundColor={WORLD_COLORS.horizon}
      />
      <directionalLight
        position={[28, 20, 12]}
        intensity={1.8}
        color={WORLD_COLORS.sun}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={120}
        shadow-camera-left={-36}
        shadow-camera-right={36}
        shadow-camera-top={36}
        shadow-camera-bottom={-36}
      />
      <directionalLight
        position={[-36, 12, -18]}
        intensity={0.35}
        color={WORLD_COLORS.rim}
      />

      <SpawnPoint position={WORLD_SPAWN_POINT} yaw={180} />

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

      <RigidBody type="fixed" colliders={false} friction={1.1} restitution={0}>
        <CylinderCollider args={[0.12, 3.2]} position={[0, 0.12, 0]} />
        <mesh position={[0, 0.12, 0]} receiveShadow>
          <cylinderGeometry args={[3.2, 3.2, 0.24, 64]} />
          <meshStandardMaterial
            color="#4b4f57"
            emissive="#0f172a"
            emissiveIntensity={0.18}
            roughness={0.96}
            metalness={0.05}
          />
        </mesh>
        <mesh position={[0, 0.245, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[1.75, 2.85, 64]} />
          <meshStandardMaterial
            color="#aab0bc"
            emissive="#c7d2fe"
            emissiveIntensity={0.16}
            roughness={0.72}
            metalness={0.08}
          />
        </mesh>
      </RigidBody>

      <MoonRig worldPosition={position} worldScale={scale} />
    </group>
  )
}
