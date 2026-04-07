import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { useXRift } from '@xrift/world-components'
import { useRef } from 'react'
import {
  BackSide,
  Mesh,
  RepeatWrapping,
  SRGBColorSpace,
} from 'three'
import {
  SKYBOX_RADIUS,
  SPACE_SKYBOX_TEXTURE_PATH,
} from '../../constants'

interface SpaceBackdropProps {
  worldPosition: [number, number, number]
  worldScale: number
}

export function SpaceBackdrop({
  worldPosition,
  worldScale,
}: SpaceBackdropProps) {
  const { camera } = useThree()
  const { baseUrl } = useXRift()
  const domeRef = useRef<Mesh>(null)
  const texture = useTexture(`${baseUrl}${SPACE_SKYBOX_TEXTURE_PATH}`)

  texture.colorSpace = SRGBColorSpace
  texture.wrapS = RepeatWrapping
  texture.repeat.x = -1
  texture.offset.x = 1

  useFrame(() => {
    const dome = domeRef.current
    if (!dome) return

    const safeScale = worldScale || 1
    dome.position.set(
      (camera.position.x - worldPosition[0]) / safeScale,
      (camera.position.y - worldPosition[1]) / safeScale,
      (camera.position.z - worldPosition[2]) / safeScale,
    )
  })

  return (
    <mesh ref={domeRef}>
      <sphereGeometry args={[SKYBOX_RADIUS, 48, 32]} />
      <meshBasicMaterial
        side={BackSide}
        map={texture}
        toneMapped={false}
        fog={false}
      />
    </mesh>
  )
}
