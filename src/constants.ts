export const WORLD_TITLE = 'Luna Atlas'

export const MOON_TEXTURE_PATH = 'moon-surface-runtime.jpg'
export const MOON_HEIGHT_TEXTURE_PATH = 'moon-height-runtime.png'
export const MOON_THUMBNAIL_PATH = 'moon-thumbnail.jpg'

export const PHYSICS_GROUND_SIZE = 240
export const PHYSICS_GROUND_HEIGHT = 0.5

export const MOON_MODEL_RADIUS = 3
export const MOON_EXHIBIT_POSITION: [number, number, number] = [0, 7.2, -14]
export const MOON_SHARED_STATE_ID = 'moon-exhibit-transform'
export const MOON_MIN_SCALE = 0.7
export const MOON_MAX_SCALE = 1.8
export const MOON_ROTATION_STEP = Math.PI / 10
export const MOON_POSITION_STEP = 0.9
export const MOON_RESET_LERP = 0.1
export const MOON_TARGET_OFFSET_LIMIT_X = 3.2
export const MOON_TARGET_OFFSET_MIN_Y = -1.4
export const MOON_TARGET_OFFSET_MAX_Y = 2.6
export const MOON_DECK_Y = MOON_EXHIBIT_POSITION[1] - 1.6
export const MOON_DECK_RADIUS = MOON_MODEL_RADIUS + 3.8
export const MOON_DECK_WIDTH = 1.85
export const MOON_DECK_SEGMENTS = 16
export const MOON_INTERACTION_ROTATE_SPEED = 0.0085
export const MOON_INTERACTION_SCALE_SPEED = 0.0015

export const MOON_TRANSIT_RING_Y = MOON_DECK_Y
export const MOON_TRANSIT_RING_Z_FRONT = MOON_EXHIBIT_POSITION[2] + MOON_DECK_RADIUS
export const MOON_CLOSE_PLATFORM_DISTANCE = MOON_MODEL_RADIUS + 1.15
export const MOON_CLOSE_PLATFORM_Y = MOON_EXHIBIT_POSITION[1] + 0.3
export const MOON_OVERVIEW_PLATFORM_POSITION: [number, number, number] = [
  0,
  MOON_TRANSIT_RING_Y,
  MOON_TRANSIT_RING_Z_FRONT,
]
export const MOON_CONTROL_PANEL_POSITION: [number, number, number] = [
  6.4,
  MOON_TRANSIT_RING_Y + 1.2,
  MOON_TRANSIT_RING_Z_FRONT + 0.6,
]
export const DEV_SPAWN_POSITION: [number, number, number] = [
  0,
  MOON_DECK_Y + 0.35,
  MOON_EXHIBIT_POSITION[2] - MOON_DECK_RADIUS,
]
export const WORLD_SPAWN_POINT: [number, number, number] = [
  0,
  MOON_DECK_Y + 0.15,
  MOON_EXHIBIT_POSITION[2] - MOON_DECK_RADIUS,
]
export const MOON_OVERVIEW_TELEPORT_TARGET: [number, number, number] = [
  0,
  MOON_DECK_Y + 0.35,
  MOON_EXHIBIT_POSITION[2] - MOON_DECK_RADIUS,
]

export const STAR_COUNT = 1600
export const STARFIELD_RADIUS = 260

export const OBSERVATION_RING_RADIUS = 6.2
export const OBSERVATION_RING_HEIGHT = 0.28
export const OBSERVATION_RING_THICKNESS = 0.34

export const WORLD_COLORS = {
  background: '#010208',
  horizon: '#0a0d16',
  moonTint: '#ddd9d1',
  moonShadow: '#55585f',
  craterRim: '#70747d',
  rockDark: '#6d7078',
  rockLight: '#9a9da5',
  sun: '#f6f1de',
  rim: '#7d93c7',
  platform: '#363c48',
  platformTrim: '#9ea8ba',
  panel: '#161c27',
  panelGlow: '#7aa4ff',
  accent: '#dbeafe',
  warning: '#fbbf24',
} as const
