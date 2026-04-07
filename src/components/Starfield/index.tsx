import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import {
  Color,
  Points,
} from 'three'
import {
  STAR_COUNT,
  STARFIELD_RADIUS,
} from '../../constants'

interface StarfieldProps {
  worldPosition: [number, number, number]
  worldScale: number
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0

  return () => {
    state = (1664525 * state + 1013904223) >>> 0
    return state / 0x100000000
  }
}

function buildStarfieldData() {
  const positions = new Float32Array(STAR_COUNT * 3)
  const colors = new Float32Array(STAR_COUNT * 3)
  const random = createSeededRandom(42)
  const cool = new Color('#9bb4ff')
  const neutral = new Color('#f8fbff')
  const warm = new Color('#ffe8c4')

  for (let index = 0; index < STAR_COUNT; index += 1) {
    const radius = STARFIELD_RADIUS * (0.78 + random() * 0.22)
    const theta = random() * Math.PI * 2
    const phi = Math.acos(1 - 2 * random())
    const sinPhi = Math.sin(phi)
    const brightness = 0.4 + random() * 0.6
    const color =
      index % 7 === 0
        ? cool.clone().lerp(neutral, random())
        : index % 11 === 0
        ? warm.clone().lerp(neutral, random())
        : neutral.clone()

    positions[index * 3] = radius * sinPhi * Math.cos(theta)
    positions[index * 3 + 1] = radius * Math.cos(phi)
    positions[index * 3 + 2] = radius * sinPhi * Math.sin(theta)

    colors[index * 3] = color.r * brightness
    colors[index * 3 + 1] = color.g * brightness
    colors[index * 3 + 2] = color.b * brightness
  }

  return { positions, colors }
}

const STARFIELD_DATA = buildStarfieldData()

export function Starfield({
  worldPosition,
  worldScale,
}: StarfieldProps) {
  const { camera } = useThree()
  const pointsRef = useRef<Points>(null)

  useFrame(() => {
    const points = pointsRef.current
    if (!points) return

    const safeScale = worldScale || 1
    points.position.set(
      (camera.position.x - worldPosition[0]) / safeScale,
      (camera.position.y - worldPosition[1]) / safeScale,
      (camera.position.z - worldPosition[2]) / safeScale,
    )
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[STARFIELD_DATA.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[STARFIELD_DATA.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={1.35}
        sizeAttenuation
        transparent
        opacity={0.95}
        depthWrite={false}
      />
    </points>
  )
}
