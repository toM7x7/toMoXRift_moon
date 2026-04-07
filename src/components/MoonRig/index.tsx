import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Group, Quaternion, Vector3 } from 'three'
import {
  PLANET_RADIUS,
  PLANET_RESET_DISTANCE,
} from '../../constants'
import { MoonFeatureField } from '../MoonFeatureField'
import { MoonSurface } from '../MoonSurface'

interface MoonRigProps {
  worldPosition: [number, number, number]
  worldScale: number
}

const EPSILON = 0.0001

export function MoonRig({
  worldPosition,
  worldScale,
}: MoonRigProps) {
  const { camera } = useThree()
  const rigRef = useRef<Group>(null)
  const initializedRef = useRef(false)
  const lastGroundPositionRef = useRef(new Vector3())
  const rotationRef = useRef(new Quaternion())
  const axisRef = useRef(new Vector3())
  const deltaRotationRef = useRef(new Quaternion())

  useFrame(() => {
    const rig = rigRef.current
    if (!rig) return

    const safeScale = worldScale || 1
    const localX = (camera.position.x - worldPosition[0]) / safeScale
    const localZ = (camera.position.z - worldPosition[2]) / safeScale

    rig.position.set(localX, -PLANET_RADIUS, localZ)

    if (!initializedRef.current) {
      lastGroundPositionRef.current.set(localX, 0, localZ)
      rig.quaternion.copy(rotationRef.current)
      initializedRef.current = true
      return
    }

    const dx = localX - lastGroundPositionRef.current.x
    const dz = localZ - lastGroundPositionRef.current.z
    const distance = Math.hypot(dx, dz)

    if (distance > EPSILON && distance < PLANET_RESET_DISTANCE) {
      axisRef.current.set(dz / distance, 0, -dx / distance)
      deltaRotationRef.current.setFromAxisAngle(
        axisRef.current,
        distance / PLANET_RADIUS,
      )
      rotationRef.current.premultiply(deltaRotationRef.current)
    }

    lastGroundPositionRef.current.set(localX, 0, localZ)
    rig.quaternion.copy(rotationRef.current)
  })

  return (
    <group ref={rigRef}>
      <MoonSurface />
      <MoonFeatureField />
    </group>
  )
}
