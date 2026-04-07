import type { ThreeElements } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useXRift } from '@xrift/world-components'
import {
  SphereGeometry,
  SRGBColorSpace,
} from 'three'
import {
  MOON_HEIGHT_TEXTURE_PATH,
  MOON_MODEL_RADIUS,
  MOON_TEXTURE_PATH,
  WORLD_COLORS
} from '../../constants'
import heightStats from '../../generated/moon-height-stats.json'

const MOON_GEOMETRY = new SphereGeometry(MOON_MODEL_RADIUS, 256, 128)
const WORLD_UNITS_PER_KM = MOON_MODEL_RADIUS / heightStats.referenceRadiusKm
const DISPLACEMENT_SCALE =
  heightStats.rangeKm *
  WORLD_UNITS_PER_KM *
  heightStats.displacementExaggeration
const DISPLACEMENT_BIAS =
  heightStats.minKm *
  WORLD_UNITS_PER_KM *
  heightStats.displacementExaggeration

type MoonSurfaceProps = Omit<ThreeElements['mesh'], 'rotation'> & {
  rotation?: [number, number, number]
}

export function MoonSurface({
  rotation = [0, Math.PI, 0],
  ...meshProps
}: MoonSurfaceProps) {
  const { baseUrl } = useXRift()
  const [texture, heightTexture] = useTexture([
    `${baseUrl}${MOON_TEXTURE_PATH}`,
    `${baseUrl}${MOON_HEIGHT_TEXTURE_PATH}`,
  ])

  texture.colorSpace = SRGBColorSpace

  return (
    <mesh
      geometry={MOON_GEOMETRY}
      castShadow
      receiveShadow
      rotation={rotation}
      {...meshProps}
    >
      <meshStandardMaterial
        map={texture}
        bumpMap={heightTexture}
        bumpScale={0.24}
        displacementMap={heightTexture}
        displacementScale={DISPLACEMENT_SCALE}
        displacementBias={DISPLACEMENT_BIAS}
        color={WORLD_COLORS.moonTint}
        emissive={WORLD_COLORS.moonTint}
        emissiveIntensity={0.06}
        roughness={0.94}
        metalness={0}
      />
    </mesh>
  )
}
