import {
  MOON_EXHIBIT_POSITION,
  MOON_MAX_SCALE,
  MOON_MIN_SCALE,
  MOON_TARGET_OFFSET_LIMIT_X,
  MOON_TARGET_OFFSET_MAX_Y,
  MOON_TARGET_OFFSET_MIN_Y,
} from './constants'

export interface MoonTransformState {
  rotationX: number
  rotationY: number
  offsetX: number
  offsetY: number
  scale: number
}

export const DEFAULT_MOON_TRANSFORM: MoonTransformState = {
  rotationX: -0.14,
  rotationY: Math.PI * 0.92,
  offsetX: 0,
  offsetY: 0,
  scale: 1,
}

export function clampMoonScale(scale: number) {
  return Math.min(MOON_MAX_SCALE, Math.max(MOON_MIN_SCALE, scale))
}

export function clampMoonOffsetX(offsetX: number) {
  return Math.min(MOON_TARGET_OFFSET_LIMIT_X, Math.max(-MOON_TARGET_OFFSET_LIMIT_X, offsetX))
}

export function clampMoonOffsetY(offsetY: number) {
  return Math.min(MOON_TARGET_OFFSET_MAX_Y, Math.max(MOON_TARGET_OFFSET_MIN_Y, offsetY))
}

export function getMoonWorldPosition(state: MoonTransformState): [number, number, number] {
  return [
    MOON_EXHIBIT_POSITION[0] + clampMoonOffsetX(state.offsetX),
    MOON_EXHIBIT_POSITION[1] + clampMoonOffsetY(state.offsetY),
    MOON_EXHIBIT_POSITION[2],
  ]
}
