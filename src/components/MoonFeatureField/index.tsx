import {
  CircleGeometry,
  DoubleSide,
  Euler,
  IcosahedronGeometry,
  MathUtils,
  Quaternion,
  Vector3,
} from 'three'
import {
  PLANET_RADIUS,
  WORLD_COLORS,
} from '../../constants'

interface CraterSpec {
  latitude: number
  longitude: number
  radius: number
}

interface RockSpec {
  latitude: number
  longitude: number
  scale: [number, number, number]
  tint: keyof typeof WORLD_COLORS
}

const CRATER_DISC = new CircleGeometry(1, 48)
const ROCK_GEOMETRY = new IcosahedronGeometry(0.55, 1)
const UP = new Vector3(0, 1, 0)

const CRATERS: CraterSpec[] = [
  { latitude: 72, longitude: -12, radius: 1.6 },
  { latitude: 68, longitude: 22, radius: 1.1 },
  { latitude: 62, longitude: -34, radius: 1.4 },
  { latitude: 58, longitude: 48, radius: 0.9 },
  { latitude: 54, longitude: 6, radius: 1.25 },
  { latitude: 49, longitude: -56, radius: 1.0 },
]

const ROCKS: RockSpec[] = [
  { latitude: 76, longitude: 18, scale: [0.38, 0.22, 0.32], tint: 'rockDark' },
  { latitude: 74, longitude: -28, scale: [0.22, 0.3, 0.2], tint: 'rockLight' },
  { latitude: 69, longitude: 37, scale: [0.28, 0.18, 0.36], tint: 'rockDark' },
  { latitude: 66, longitude: -8, scale: [0.2, 0.25, 0.22], tint: 'rockLight' },
  { latitude: 64, longitude: -44, scale: [0.31, 0.2, 0.18], tint: 'rockDark' },
  { latitude: 61, longitude: 58, scale: [0.26, 0.28, 0.24], tint: 'rockLight' },
  { latitude: 57, longitude: -18, scale: [0.22, 0.16, 0.34], tint: 'rockDark' },
  { latitude: 53, longitude: 28, scale: [0.18, 0.22, 0.18], tint: 'rockLight' },
]

function getSurfaceTransform(
  latitude: number,
  longitude: number,
  elevation: number,
) {
  const lat = MathUtils.degToRad(latitude)
  const lon = MathUtils.degToRad(longitude)
  const cosLat = Math.cos(lat)
  const normal = new Vector3(
    cosLat * Math.sin(lon),
    Math.sin(lat),
    cosLat * Math.cos(lon),
  )
  const position = normal.multiplyScalar(PLANET_RADIUS + elevation)
  const quaternion = new Quaternion().setFromUnitVectors(UP, normal.normalize())
  const euler = new Euler().setFromQuaternion(quaternion)

  return {
    position: [position.x, position.y, position.z] as [number, number, number],
    rotation: [euler.x, euler.y, euler.z] as [number, number, number],
  }
}

function MoonCrater({ latitude, longitude, radius }: CraterSpec) {
  const transform = getSurfaceTransform(latitude, longitude, 0.05)

  return (
    <group position={transform.position} rotation={transform.rotation}>
      <mesh
        geometry={CRATER_DISC}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[radius, radius, radius]}
        receiveShadow
      >
        <meshStandardMaterial
          color={WORLD_COLORS.moonShadow}
          roughness={1}
          metalness={0}
          side={DoubleSide}
        />
      </mesh>
      <mesh
        geometry={CRATER_DISC}
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[radius * 0.68, radius * 0.68, radius * 0.68]}
        receiveShadow
      >
        <meshStandardMaterial
          color={WORLD_COLORS.craterRim}
          roughness={1}
          metalness={0}
          side={DoubleSide}
        />
      </mesh>
    </group>
  )
}

function MoonRock({ latitude, longitude, scale, tint }: RockSpec) {
  const transform = getSurfaceTransform(latitude, longitude, scale[1] * 0.75)

  return (
    <group position={transform.position} rotation={transform.rotation}>
      <mesh
        geometry={ROCK_GEOMETRY}
        position={[0, scale[1] * 0.45, 0]}
        rotation={[0.3, longitude * 0.04, latitude * 0.02]}
        scale={scale}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={WORLD_COLORS[tint]}
          roughness={1}
          metalness={0}
        />
      </mesh>
    </group>
  )
}

export function MoonFeatureField() {
  return (
    <group>
      {CRATERS.map((crater, index) => (
        <MoonCrater key={`crater-${index}`} {...crater} />
      ))}
      {ROCKS.map((rock, index) => (
        <MoonRock key={`rock-${index}`} {...rock} />
      ))}
    </group>
  )
}
