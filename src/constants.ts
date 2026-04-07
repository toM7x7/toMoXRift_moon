export const WORLD_TITLE = 'Luna Atlas'

export const MOON_TEXTURE_PATH = 'moon-surface-runtime.jpg'
export const MOON_HEIGHT_TEXTURE_PATH = 'moon-height-runtime.png'
export const MOON_THUMBNAIL_PATH = 'moon-thumbnail.jpg'
export const SPACE_SKYBOX_TEXTURE_PATH = 'space-skybox-random.jpg'

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
export const MOON_DECK_Y = 4.55
export const MOON_DECK_RADIUS = 5.9
export const MOON_DECK_WIDTH = 2.1
export const MOON_DECK_HEIGHT = 0.18
export const MOON_DECK_SEGMENTS = 48
export const MOON_DECK_INNER_OPEN_SCALE = 1.25
export const MOON_MAIN_DECK_WIDTH = MOON_DECK_WIDTH * 2
export const MOON_MAIN_DECK_OUTER_RADIUS = MOON_DECK_RADIUS + MOON_DECK_WIDTH / 2
export const MOON_MAIN_DECK_BASE_INNER_RADIUS = MOON_MAIN_DECK_OUTER_RADIUS - MOON_MAIN_DECK_WIDTH
export const MOON_MAIN_DECK_INNER_RADIUS =
  MOON_MAIN_DECK_BASE_INNER_RADIUS * MOON_DECK_INNER_OPEN_SCALE
export const MOON_MAIN_DECK_CENTER_RADIUS =
  MOON_MAIN_DECK_INNER_RADIUS + MOON_MAIN_DECK_WIDTH / 2
export const MOON_MAIN_DECK_OUTER_VISIBLE_RADIUS =
  MOON_MAIN_DECK_INNER_RADIUS + MOON_MAIN_DECK_WIDTH
export const MOON_MAIN_DECK_COLLIDER_SEGMENTS = 128
export const MOON_MAIN_DECK_COLLIDER_OVERLAP = 1.08
export const MOON_UPPER_RING_Y = 9.25
export const MOON_UPPER_RING_RADIUS = 3.4
export const MOON_UPPER_RING_WIDTH = 0.52
export const MOON_UPPER_RING_HEIGHT = 0.1
export const MOON_SUPPORT_RADIUS = 0.28
export const MOON_INTERACTION_ROTATE_SPEED = 0.0085
export const MOON_INTERACTION_SCALE_SPEED = 0.0015

export const MOON_TRANSIT_RING_Y = MOON_DECK_Y
export const MOON_TRANSIT_RING_Z_FRONT = MOON_EXHIBIT_POSITION[2] + MOON_DECK_RADIUS
export const MOON_CLOSE_PLATFORM_DISTANCE = MOON_MODEL_RADIUS + 1.15
export const MOON_CLOSE_PLATFORM_Y = MOON_EXHIBIT_POSITION[1] + 0.3
export const MOON_CONTROL_PANEL_POSITION: [number, number, number] = [
  6.4,
  MOON_TRANSIT_RING_Y + 1.2,
  MOON_TRANSIT_RING_Z_FRONT + 0.6,
]
export const MOON_SPAWN_POSITION_Z =
  MOON_EXHIBIT_POSITION[2] - MOON_MAIN_DECK_CENTER_RADIUS
export const DEV_SPAWN_POSITION: [number, number, number] = [
  0,
  MOON_DECK_Y + 0.5,
  MOON_SPAWN_POSITION_Z,
]
export const WORLD_SPAWN_POINT: [number, number, number] = [
  0,
  MOON_DECK_Y + 0.3,
  MOON_SPAWN_POSITION_Z,
]
export const MOON_OVERVIEW_TELEPORT_TARGET: [number, number, number] = [
  0,
  MOON_DECK_Y + 0.5,
  MOON_SPAWN_POSITION_Z,
]

export const STAR_COUNT = 1600
export const STARFIELD_RADIUS = 260
export const SKYBOX_RADIUS = 340

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
