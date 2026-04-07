import { CuboidCollider, CylinderCollider, RigidBody } from '@react-three/rapier'
import { useMemo } from 'react'
import { ExtrudeGeometry, Path, Shape } from 'three'
import {
  MOON_DECK_HEIGHT,
  MOON_MAIN_DECK_CENTER_RADIUS,
  MOON_MAIN_DECK_COLLIDER_OVERLAP,
  MOON_MAIN_DECK_COLLIDER_SEGMENTS,
  MOON_MAIN_DECK_INNER_RADIUS,
  MOON_MAIN_DECK_OUTER_VISIBLE_RADIUS,
  MOON_DECK_Y,
  MOON_EXHIBIT_POSITION,
  MOON_SUPPORT_RADIUS,
  MOON_UPPER_RING_HEIGHT,
  MOON_DECK_SEGMENTS,
  MOON_UPPER_RING_RADIUS,
  MOON_UPPER_RING_WIDTH,
  MOON_UPPER_RING_Y,
  WORLD_COLORS,
} from '../../constants'

const MAIN_DECK_WIDTH = MOON_MAIN_DECK_OUTER_VISIBLE_RADIUS - MOON_MAIN_DECK_INNER_RADIUS
const SUPPORT_POINTS = [
  [0, MOON_EXHIBIT_POSITION[2] + MOON_MAIN_DECK_CENTER_RADIUS],
  [MOON_MAIN_DECK_CENTER_RADIUS, MOON_EXHIBIT_POSITION[2]],
  [0, MOON_EXHIBIT_POSITION[2] - MOON_MAIN_DECK_CENTER_RADIUS],
  [-MOON_MAIN_DECK_CENTER_RADIUS, MOON_EXHIBIT_POSITION[2]],
] as const

function createRingSegments(
  radius: number,
  surfaceY: number,
  height: number,
  segmentCount: number,
) {
  return Array.from({ length: segmentCount }, (_, index) => {
    const angle = (index / segmentCount) * Math.PI * 2
    const x = Math.sin(angle) * radius
    const z = MOON_EXHIBIT_POSITION[2] + Math.cos(angle) * radius

    return {
      index,
      angle,
      position: [x, surfaceY - height / 2, z] as [number, number, number],
    }
  })
}

function getSegmentLength(radius: number, segmentCount: number, overlap: number = 1) {
  return ((Math.PI * 2 * radius) / segmentCount) * overlap
}

function createDeckPlateGeometry(innerRadius: number, outerRadius: number, height: number) {
  const shape = new Shape()
  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false)

  const hole = new Path()
  hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true)
  shape.holes.push(hole)

  const geometry = new ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
    curveSegments: 128,
  })

  geometry.translate(0, 0, -height / 2)
  geometry.rotateX(Math.PI / 2)
  geometry.computeVertexNormals()

  return geometry
}

export function EquatorDeck() {
  const mainSegments = useMemo(
    () =>
      createRingSegments(
        MOON_MAIN_DECK_CENTER_RADIUS,
        MOON_DECK_Y,
        MOON_DECK_HEIGHT,
        MOON_MAIN_DECK_COLLIDER_SEGMENTS,
      ),
    [],
  )
  const upperSegments = useMemo(
    () =>
      createRingSegments(
        MOON_UPPER_RING_RADIUS,
        MOON_UPPER_RING_Y,
        MOON_UPPER_RING_HEIGHT,
        MOON_DECK_SEGMENTS,
      ),
    [],
  )
  const mainSegmentLength = useMemo(
    () =>
      getSegmentLength(
        MOON_MAIN_DECK_CENTER_RADIUS,
        MOON_MAIN_DECK_COLLIDER_SEGMENTS,
        MOON_MAIN_DECK_COLLIDER_OVERLAP,
      ),
    [],
  )
  const upperSegmentLength = useMemo(
    () => getSegmentLength(MOON_UPPER_RING_RADIUS, MOON_DECK_SEGMENTS, 0.96),
    [],
  )
  const deckPlateGeometry = useMemo(
    () =>
      createDeckPlateGeometry(
        MOON_MAIN_DECK_INNER_RADIUS,
        MOON_MAIN_DECK_OUTER_VISIBLE_RADIUS,
        MOON_DECK_HEIGHT,
      ),
    [],
  )

  return (
    <group>
      <RigidBody type="fixed" colliders={false} friction={1.15} restitution={0}>
        {mainSegments.map((segment) => (
          <group
            key={`main-ring-segment-${segment.index}`}
            position={segment.position}
            rotation={[0, segment.angle, 0]}
          >
            <CuboidCollider
              args={[mainSegmentLength / 2, MOON_DECK_HEIGHT / 2, MAIN_DECK_WIDTH / 2]}
            />
          </group>
        ))}
      </RigidBody>

      <mesh
        geometry={deckPlateGeometry}
        position={[0, MOON_DECK_Y, MOON_EXHIBIT_POSITION[2]]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={WORLD_COLORS.platform}
          emissive={WORLD_COLORS.panelGlow}
          emissiveIntensity={0.04}
          roughness={0.74}
          metalness={0.18}
        />
      </mesh>

      {SUPPORT_POINTS.map(([x, z], index) => {
        const height = Math.max(MOON_DECK_Y - MOON_DECK_HEIGHT / 2, 0.1)

        return (
          <RigidBody key={`support-${index}`} type="fixed" colliders={false}>
            <CylinderCollider
              args={[height / 2, MOON_SUPPORT_RADIUS]}
              position={[x, height / 2, z]}
            />
            <mesh position={[x, height / 2, z]} castShadow receiveShadow>
              <cylinderGeometry
                args={[MOON_SUPPORT_RADIUS, MOON_SUPPORT_RADIUS * 1.18, height, 18]}
              />
              <meshStandardMaterial
                color={WORLD_COLORS.panel}
                roughness={0.84}
                metalness={0.22}
              />
            </mesh>
          </RigidBody>
        )
      })}

      <RigidBody type="fixed" colliders={false} friction={0.95} restitution={0}>
        {upperSegments.map((segment) => (
          <group
            key={`upper-ring-segment-${segment.index}`}
            position={segment.position}
            rotation={[0, segment.angle, 0]}
          >
            <CuboidCollider
              args={[
                upperSegmentLength / 2,
                MOON_UPPER_RING_HEIGHT / 2,
                MOON_UPPER_RING_WIDTH / 2,
              ]}
            />
          </group>
        ))}
      </RigidBody>
    </group>
  )
}
