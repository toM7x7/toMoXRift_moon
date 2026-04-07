import { useTexture } from '@react-three/drei'
import { useXRift } from '@xrift/world-components'
import {
  SphereGeometry,
  SRGBColorSpace,
} from 'three'
import {
  MOON_HEIGHT_TEXTURE_PATH,
  MOON_TEXTURE_PATH,
  PLANET_RADIUS,
  WORLD_COLORS
} from '../../constants'
import heightStats from '../../generated/moon-height-stats.json'

const MOON_GEOMETRY = new SphereGeometry(PLANET_RADIUS, 256, 128)
const WORLD_UNITS_PER_KM = PLANET_RADIUS / heightStats.referenceRadiusKm
const DISPLACEMENT_SCALE =
  heightStats.rangeKm *
  WORLD_UNITS_PER_KM *
  heightStats.displacementExaggeration
const DISPLACEMENT_BIAS =
  heightStats.minKm *
  WORLD_UNITS_PER_KM *
  heightStats.displacementExaggeration

export function MoonSurface() {
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
      rotation={[0, Math.PI, 0]}
    >
      <meshStandardMaterial
        map={texture}
        bumpMap={heightTexture}
        bumpScale={0.18}
        displacementMap={heightTexture}
        displacementScale={DISPLACEMENT_SCALE}
        displacementBias={DISPLACEMENT_BIAS}
        color={WORLD_COLORS.moonTint}
        roughness={1}
        metalness={0}
      />
    </mesh>
  )
}
