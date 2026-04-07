import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier'
import { useMemo } from 'react'
import {
  MOON_DECK_RADIUS,
  MOON_DECK_SEGMENTS,
  MOON_DECK_WIDTH,
  MOON_DECK_Y,
  MOON_EXHIBIT_POSITION,
  WORLD_COLORS,
} from '../../constants'

const DECK_HEIGHT = 0.34
const SEGMENT_LENGTH = ((Math.PI * 2 * MOON_DECK_RADIUS) / MOON_DECK_SEGMENTS) * 0.88
const SUPPORT_RADIUS = 0.28
const SUPPORT_POINTS = [
  [0, MOON_EXHIBIT_POSITION[2] + MOON_DECK_RADIUS],
  [MOON_DECK_RADIUS, MOON_EXHIBIT_POSITION[2]],
  [0, MOON_EXHIBIT_POSITION[2] - MOON_DECK_RADIUS],
  [-MOON_DECK_RADIUS, MOON_EXHIBIT_POSITION[2]],
] as const

function createDeckSegments() {
  return Array.from({ length: MOON_DECK_SEGMENTS }, (_, index) => {
    const angle = (index / MOON_DECK_SEGMENTS) * Math.PI * 2
    const x = Math.sin(angle) * MOON_DECK_RADIUS
    const z = MOON_EXHIBIT_POSITION[2] + Math.cos(angle) * MOON_DECK_RADIUS

    return {
      index,
      angle,
      position: [x, MOON_DECK_Y - DECK_HEIGHT / 2, z] as [number, number, number],
    }
  })
}

export function EquatorDeck() {
  const segments = useMemo(createDeckSegments, [])

  return (
    <group>
      <RigidBody type="fixed" colliders={false} friction={1.1} restitution={0}>
        {segments.map((segment) => (
          <group
            key={`deck-segment-${segment.index}`}
            position={segment.position}
            rotation={[0, segment.angle, 0]}
          >
            <CuboidCollider args={[MOON_DECK_WIDTH / 2, DECK_HEIGHT / 2, SEGMENT_LENGTH / 2]} />
            <mesh castShadow receiveShadow>
              <boxGeometry args={[MOON_DECK_WIDTH, DECK_HEIGHT, SEGMENT_LENGTH]} />
              <meshStandardMaterial
                color={WORLD_COLORS.platform}
                emissive={WORLD_COLORS.panelGlow}
                emissiveIntensity={segment.index === 0 ? 0.2 : 0.06}
                roughness={0.88}
                metalness={0.14}
              />
            </mesh>
          </group>
        ))}
      </RigidBody>

      <mesh position={[0, MOON_DECK_Y - 0.02, MOON_EXHIBIT_POSITION[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[MOON_DECK_RADIUS, MOON_DECK_WIDTH * 0.34, 16, 96]} />
        <meshStandardMaterial
          color={WORLD_COLORS.platformTrim}
          emissive={WORLD_COLORS.panelGlow}
          emissiveIntensity={0.15}
          roughness={0.48}
          metalness={0.18}
        />
      </mesh>

      <mesh position={[0, MOON_DECK_Y + 0.02, MOON_EXHIBIT_POSITION[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[MOON_DECK_RADIUS, MOON_DECK_WIDTH * 0.12, 10, 96]} />
        <meshStandardMaterial
          color={WORLD_COLORS.accent}
          emissive={WORLD_COLORS.accent}
          emissiveIntensity={0.18}
          roughness={0.4}
          metalness={0.12}
        />
      </mesh>

      {SUPPORT_POINTS.map(([x, z], index) => {
        const height = Math.max(MOON_DECK_Y, 0.1)
        return (
          <RigidBody key={`support-${index}`} type="fixed" colliders={false}>
            <CylinderCollider
              args={[height / 2, SUPPORT_RADIUS]}
              position={[x, height / 2, z]}
            />
            <mesh position={[x, height / 2, z]} castShadow receiveShadow>
              <cylinderGeometry args={[SUPPORT_RADIUS, SUPPORT_RADIUS * 1.2, height, 18]} />
              <meshStandardMaterial
                color="#2a3241"
                roughness={0.82}
                metalness={0.2}
              />
            </mesh>
          </RigidBody>
        )
      })}

      <mesh
        position={[0, MOON_DECK_Y - 0.28, MOON_EXHIBIT_POSITION[2] - MOON_DECK_RADIUS]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.56, 0.96, 32]} />
        <meshStandardMaterial
          color={WORLD_COLORS.accent}
          emissive={WORLD_COLORS.accent}
          emissiveIntensity={0.22}
          transparent
          opacity={0.9}
          roughness={0.3}
          metalness={0.04}
        />
      </mesh>
    </group>
  )
}
