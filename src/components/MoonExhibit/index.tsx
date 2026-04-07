import type { ThreeEvent } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import { BallCollider, RigidBody } from '@react-three/rapier'
import { Interactable, useInstanceState } from '@xrift/world-components'
import { useRef } from 'react'
import { type Group, Euler, MathUtils, Quaternion, Vector3 } from 'three'
import {
  DEFAULT_MOON_TRANSFORM,
  clampMoonScale,
  clampMoonOffsetX,
  clampMoonOffsetY,
  type MoonTransformState,
} from '../../moonState'
import {
  MOON_EXHIBIT_POSITION,
  MOON_INTERACTION_ROTATE_SPEED,
  MOON_INTERACTION_SCALE_SPEED,
  MOON_MAX_SCALE,
  MOON_MIN_SCALE,
  MOON_MODEL_RADIUS,
  MOON_ROTATION_STEP,
  MOON_SHARED_STATE_ID,
  OBSERVATION_RING_HEIGHT,
  OBSERVATION_RING_RADIUS,
  OBSERVATION_RING_THICKNESS,
  WORLD_COLORS,
} from '../../constants'
import { MoonSurface } from '../MoonSurface'

export const MOON_EXHIBIT_STATE_ID = MOON_SHARED_STATE_ID

export interface MoonExhibitProps {
  stateId?: string
  basePosition?: [number, number, number]
  initialState?: Partial<MoonTransformState>
  floatHeight?: number
  floatAmplitude?: number
  floatSpeed?: number
  animationSpeed?: number
  showObservationRing?: boolean
}

const DEFAULT_BASE_POSITION: [number, number, number] = MOON_EXHIBIT_POSITION
const DEFAULT_FLOAT_HEIGHT = 0.82
const DEFAULT_FLOAT_AMPLITUDE = 0.07
const DEFAULT_FLOAT_SPEED = 0.65
const DEFAULT_ANIMATION_SPEED = 7
const DEFAULT_OBSERVATION_RING = true

const DEFAULT_CLOSE_VIEW_OFFSET: [number, number, number] = [0, -0.22, 0.18]
const POSITION_SCRATCH = new Vector3()
const EULER_SCRATCH = new Euler()
const QUATERNION_SCRATCH = new Quaternion()
const MIN_PITCH = -Math.PI * 0.42
const MAX_PITCH = Math.PI * 0.42
const CONTROL_ZONE_DEPTH = 0.14

function mergeMoonState(initialState?: Partial<MoonTransformState>) {
  return {
    ...DEFAULT_MOON_TRANSFORM,
    ...initialState,
  }
}

function resolveMoonPosition(
  basePosition: [number, number, number],
  state: MoonTransformState,
) {
  return POSITION_SCRATCH.set(
    basePosition[0] + clampMoonOffsetX(state.offsetX),
    basePosition[1] + clampMoonOffsetY(state.offsetY),
    basePosition[2],
  )
}

function resolveMoonQuaternion(state: MoonTransformState) {
  EULER_SCRATCH.set(state.rotationX, state.rotationY, 0, 'XYZ')
  return QUATERNION_SCRATCH.setFromEuler(EULER_SCRATCH)
}

function getScaleTarget(state: MoonTransformState) {
  return clampMoonScale(state.scale)
}

export function stepMoonRotationX(
  prev: MoonTransformState,
  delta: number,
) {
  return {
    ...prev,
    rotationX: prev.rotationX + delta,
  }
}

export function stepMoonRotationY(
  prev: MoonTransformState,
  delta: number,
) {
  return {
    ...prev,
    rotationY: prev.rotationY + delta,
  }
}

export function stepMoonOffsetX(
  prev: MoonTransformState,
  delta: number,
) {
  return {
    ...prev,
    offsetX: prev.offsetX + delta,
  }
}

export function stepMoonOffsetY(
  prev: MoonTransformState,
  delta: number,
) {
  return {
    ...prev,
    offsetY: prev.offsetY + delta,
  }
}

export function setMoonScale(
  prev: MoonTransformState,
  scale: number,
) {
  return {
    ...prev,
    scale: clampMoonScale(scale),
  }
}

export function stepMoonScale(
  prev: MoonTransformState,
  delta: number,
) {
  return setMoonScale(prev, prev.scale + delta)
}

export function resetMoonTransform() {
  return DEFAULT_MOON_TRANSFORM
}

export function MoonExhibit({
  stateId = MOON_EXHIBIT_STATE_ID,
  basePosition = DEFAULT_BASE_POSITION,
  initialState,
  floatHeight = DEFAULT_FLOAT_HEIGHT,
  floatAmplitude = DEFAULT_FLOAT_AMPLITUDE,
  floatSpeed = DEFAULT_FLOAT_SPEED,
  animationSpeed = DEFAULT_ANIMATION_SPEED,
  showObservationRing = DEFAULT_OBSERVATION_RING,
}: MoonExhibitProps) {
  const [sharedState, setSharedState] = useInstanceState<MoonTransformState>(
    stateId,
    mergeMoonState(initialState),
  )
  const rootRef = useRef<Group>(null)
  const moonRigRef = useRef<Group>(null)
  const interactionRigRef = useRef<Group>(null)
  const currentPositionRef = useRef(new Vector3())
  const currentQuaternionRef = useRef(new Quaternion())
  const currentScaleRef = useRef(1)
  const initializedRef = useRef(false)
  const dragStateRef = useRef({
    active: false,
    pointerId: -1,
    lastX: 0,
    lastY: 0,
  })

  function finishDrag() {
    dragStateRef.current.active = false
    dragStateRef.current.pointerId = -1
    document.body.style.cursor = ''
  }

  function handlePointerDown(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation()
    dragStateRef.current.active = true
    dragStateRef.current.pointerId = event.pointerId
    dragStateRef.current.lastX = event.clientX
    dragStateRef.current.lastY = event.clientY
    document.body.style.cursor = 'grabbing'
  }

  function handlePointerMove(event: ThreeEvent<PointerEvent>) {
    if (
      !dragStateRef.current.active ||
      dragStateRef.current.pointerId !== event.pointerId
    ) {
      return
    }

    event.stopPropagation()

    const dx = event.clientX - dragStateRef.current.lastX
    const dy = event.clientY - dragStateRef.current.lastY
    dragStateRef.current.lastX = event.clientX
    dragStateRef.current.lastY = event.clientY

    if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) {
      return
    }

    setSharedState((prev) => ({
      ...prev,
      rotationX: MathUtils.clamp(
        prev.rotationX - dy * MOON_INTERACTION_ROTATE_SPEED,
        MIN_PITCH,
        MAX_PITCH,
      ),
      rotationY: prev.rotationY + dx * MOON_INTERACTION_ROTATE_SPEED,
      offsetX: 0,
      offsetY: 0,
    }))
  }

  function handlePointerUp(event: ThreeEvent<PointerEvent>) {
    if (dragStateRef.current.pointerId !== event.pointerId) {
      return
    }

    event.stopPropagation()
    finishDrag()
  }

  function handlePointerOut(event: ThreeEvent<PointerEvent>) {
    if (dragStateRef.current.active && dragStateRef.current.pointerId === event.pointerId) {
      event.stopPropagation()
      finishDrag()
      return
    }

    document.body.style.cursor = ''
  }

  function handlePointerEnter() {
    if (!dragStateRef.current.active) {
      document.body.style.cursor = 'grab'
    }
  }

  function handleWheel(event: ThreeEvent<WheelEvent>) {
    event.stopPropagation()
    setSharedState((prev) => ({
      ...prev,
      scale: clampMoonScale(prev.scale - event.deltaY * MOON_INTERACTION_SCALE_SPEED),
      offsetX: 0,
      offsetY: 0,
    }))
  }

  const colliderRadius = MOON_MODEL_RADIUS * clampMoonScale(sharedState.scale)
  const controlShellDistance = Math.max(colliderRadius + 1.25, 4.1)
  const largeControlWidth = colliderRadius * 1.1
  const largeControlHeight = colliderRadius * 0.62
  const sideControlWidth = colliderRadius * 0.58
  const sideControlHeight = colliderRadius * 1.08
  const cornerControlSize = colliderRadius * 0.46

  function updateSharedState(update: (prev: MoonTransformState) => MoonTransformState) {
    setSharedState((prev) => {
      const next = update(prev)
      return {
        ...next,
        offsetX: 0,
        offsetY: 0,
      }
    })
  }

  function rotateMoonUp() {
    updateSharedState((prev) => ({
      ...prev,
      rotationX: MathUtils.clamp(prev.rotationX + MOON_ROTATION_STEP, MIN_PITCH, MAX_PITCH),
    }))
  }

  function rotateMoonDown() {
    updateSharedState((prev) => ({
      ...prev,
      rotationX: MathUtils.clamp(prev.rotationX - MOON_ROTATION_STEP, MIN_PITCH, MAX_PITCH),
    }))
  }

  function rotateMoonLeft() {
    updateSharedState((prev) => ({
      ...prev,
      rotationY: prev.rotationY - MOON_ROTATION_STEP,
    }))
  }

  function rotateMoonRight() {
    updateSharedState((prev) => ({
      ...prev,
      rotationY: prev.rotationY + MOON_ROTATION_STEP,
    }))
  }

  function scaleMoonUp() {
    updateSharedState((prev) => ({
      ...prev,
      scale: clampMoonScale(prev.scale + 0.08),
    }))
  }

  function scaleMoonDown() {
    updateSharedState((prev) => ({
      ...prev,
      scale: clampMoonScale(prev.scale - 0.08),
    }))
  }

  useFrame(({ camera, clock }, delta) => {
    const root = rootRef.current
    const moonRig = moonRigRef.current
    const interactionRig = interactionRigRef.current
    if (!root || !moonRig) return

    const floatOffset =
      floatHeight +
      Math.sin(clock.elapsedTime * floatSpeed) * floatAmplitude
    const targetPosition = resolveMoonPosition(basePosition, sharedState)

    targetPosition.y += floatOffset
    currentPositionRef.current.copy(targetPosition)

    const targetQuaternion = resolveMoonQuaternion(sharedState)
    const targetScale = MathUtils.clamp(
      getScaleTarget(sharedState),
      MOON_MIN_SCALE,
      MOON_MAX_SCALE,
    )

    if (!initializedRef.current) {
      root.position.copy(currentPositionRef.current)
      moonRig.quaternion.copy(targetQuaternion)
      moonRig.scale.setScalar(targetScale)
      currentQuaternionRef.current.copy(targetQuaternion)
      currentScaleRef.current = targetScale
      initializedRef.current = true
      return
    }

    const lerpAlpha = 1 - Math.exp(-animationSpeed * delta)
    root.position.lerp(currentPositionRef.current, lerpAlpha)
    currentQuaternionRef.current.slerp(targetQuaternion, lerpAlpha)
    moonRig.quaternion.copy(currentQuaternionRef.current)
    currentScaleRef.current = MathUtils.damp(
      currentScaleRef.current,
      targetScale,
      animationSpeed,
      delta,
    )
    moonRig.scale.setScalar(currentScaleRef.current)

    if (interactionRig) {
      interactionRig.quaternion.copy(camera.quaternion)
    }
  })

  return (
    <group ref={rootRef}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[4, 8, 6]} intensity={1.35} color="#f7f0de" />
      <directionalLight position={[-4, 2, -3]} intensity={0.28} color="#8ea3d8" />
      <directionalLight position={[0, 0.5, 12]} intensity={1.15} color="#fff6e5" />

      {showObservationRing ? (
        <group position={[0, -0.92, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <ringGeometry args={[OBSERVATION_RING_RADIUS, OBSERVATION_RING_RADIUS + OBSERVATION_RING_THICKNESS, 64]} />
            <meshStandardMaterial
              color={WORLD_COLORS.panel}
              emissive={WORLD_COLORS.panelGlow}
              emissiveIntensity={0.18}
              roughness={0.88}
              metalness={0.1}
              transparent
              opacity={0.85}
            />
          </mesh>
          <mesh
            position={[0, OBSERVATION_RING_HEIGHT, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <ringGeometry args={[OBSERVATION_RING_RADIUS - 0.55, OBSERVATION_RING_RADIUS - 0.28, 64]} />
            <meshStandardMaterial
              color={WORLD_COLORS.accent}
              emissive={WORLD_COLORS.accent}
              emissiveIntensity={0.08}
              roughness={0.78}
              metalness={0.05}
              transparent
              opacity={0.45}
            />
          </mesh>
        </group>
      ) : null}

      <RigidBody
        type="fixed"
        colliders={false}
        position={DEFAULT_CLOSE_VIEW_OFFSET}
        restitution={0}
        friction={1}
      >
        <BallCollider args={[colliderRadius]} />
      </RigidBody>

      <group ref={interactionRigRef} position={DEFAULT_CLOSE_VIEW_OFFSET}>
        <Interactable
          id="moon-tilt-up"
          interactionText="月を上へ回す"
          onInteract={rotateMoonUp}
        >
          <mesh position={[0, colliderRadius * 0.7, -controlShellDistance]}>
            <boxGeometry args={[largeControlWidth, largeControlHeight, CONTROL_ZONE_DEPTH]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </Interactable>

        <Interactable
          id="moon-tilt-down"
          interactionText="月を下へ回す"
          onInteract={rotateMoonDown}
        >
          <mesh position={[0, -colliderRadius * 0.7, -controlShellDistance]}>
            <boxGeometry args={[largeControlWidth, largeControlHeight, CONTROL_ZONE_DEPTH]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </Interactable>

        <Interactable
          id="moon-rotate-left"
          interactionText="月を左へ回す"
          onInteract={rotateMoonLeft}
        >
          <mesh position={[-colliderRadius * 0.74, 0, -controlShellDistance]}>
            <boxGeometry args={[sideControlWidth, sideControlHeight, CONTROL_ZONE_DEPTH]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </Interactable>

        <Interactable
          id="moon-rotate-right"
          interactionText="月を右へ回す"
          onInteract={rotateMoonRight}
        >
          <mesh position={[colliderRadius * 0.74, 0, -controlShellDistance]}>
            <boxGeometry args={[sideControlWidth, sideControlHeight, CONTROL_ZONE_DEPTH]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </Interactable>

        <Interactable
          id="moon-scale-down"
          interactionText="月を縮小"
          onInteract={scaleMoonDown}
        >
          <mesh position={[-colliderRadius * 0.5, colliderRadius * 0.45, -controlShellDistance]}>
            <boxGeometry args={[cornerControlSize, cornerControlSize, CONTROL_ZONE_DEPTH]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </Interactable>

        <Interactable
          id="moon-scale-up"
          interactionText="月を拡大"
          onInteract={scaleMoonUp}
        >
          <mesh position={[colliderRadius * 0.5, colliderRadius * 0.45, -controlShellDistance]}>
            <boxGeometry args={[cornerControlSize, cornerControlSize, CONTROL_ZONE_DEPTH]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </Interactable>
      </group>

      <group ref={moonRigRef} position={DEFAULT_CLOSE_VIEW_OFFSET}>
        <MoonSurface
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerOut={handlePointerOut}
          onPointerEnter={handlePointerEnter}
          onWheel={handleWheel}
        />
      </group>
    </group>
  )
}
