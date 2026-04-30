export const sharpsOrder = ['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#']
export const flatsOrder = ['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb']

export interface CircleEntry {
  major: string
  minor: string
  sharps: number   // positive = sharps, 0 = none
  flats: number    // positive = flats, 0 = none
  enharmonic: string | null
}

// Clockwise order starting at C
export const CIRCLE: CircleEntry[] = [
  { major: 'C',  minor: 'Am',  sharps: 0, flats: 0, enharmonic: null },
  { major: 'G',  minor: 'Em',  sharps: 1, flats: 0, enharmonic: null },
  { major: 'D',  minor: 'Bm',  sharps: 2, flats: 0, enharmonic: null },
  { major: 'A',  minor: 'F#m', sharps: 3, flats: 0, enharmonic: null },
  { major: 'E',  minor: 'C#m', sharps: 4, flats: 0, enharmonic: null },
  { major: 'B',  minor: 'G#m', sharps: 5, flats: 0, enharmonic: 'Cb' },
  { major: 'F#', minor: 'D#m', sharps: 6, flats: 6, enharmonic: 'Gb' },
  { major: 'Db', minor: 'Bbm', sharps: 0, flats: 5, enharmonic: 'C#' },
  { major: 'Ab', minor: 'Fm',  sharps: 0, flats: 4, enharmonic: null },
  { major: 'Eb', minor: 'Cm',  sharps: 0, flats: 3, enharmonic: null },
  { major: 'Bb', minor: 'Gm',  sharps: 0, flats: 2, enharmonic: null },
  { major: 'F',  minor: 'Dm',  sharps: 0, flats: 1, enharmonic: null },
]

const ENHARMONIC_MAP: Record<string, string> = {
  'F#': 'Gb', 'Gb': 'F#',
  'B': 'Cb', 'Cb': 'B',
  'Db': 'C#', 'C#': 'Db',
}

function indexOfMajor(note: string): number {
  return CIRCLE.findIndex(e => e.major === note || e.enharmonic === note)
}

export function getStepsFrom(note: string, steps: number): string {
  const idx = indexOfMajor(note)
  if (idx === -1) throw new Error(`Unknown note: ${note}`)
  const newIdx = ((idx + steps) % 12 + 12) % 12
  return CIRCLE[newIdx].major
}

export function getRelativeMinor(major: string): string {
  const entry = CIRCLE.find(e => e.major === major || e.enharmonic === major)
  if (!entry) throw new Error(`Unknown key: ${major}`)
  return entry.minor
}

export function getOppositeKey(major: string): string {
  const idx = indexOfMajor(major)
  if (idx === -1) throw new Error(`Unknown key: ${major}`)
  const opposite = CIRCLE[(idx + 6) % 12]
  return opposite.enharmonic ? `${opposite.major}/${opposite.enharmonic}` : opposite.major
}

export interface KeySignature {
  count: number
  type: 'sharp' | 'flat' | null
  notes: string[]
}

export function getKeySignature(major: string): KeySignature {
  const entry = CIRCLE.find(e => e.major === major || e.enharmonic === major)
  if (!entry) throw new Error(`Unknown key: ${major}`)
  if (entry.sharps > 0) {
    return { count: entry.sharps, type: 'sharp', notes: sharpsOrder.slice(0, entry.sharps) }
  }
  if (entry.flats > 0) {
    return { count: entry.flats, type: 'flat', notes: flatsOrder.slice(0, entry.flats) }
  }
  return { count: 0, type: null, notes: [] }
}

export function getEnharmonic(note: string): string | null {
  return ENHARMONIC_MAP[note] ?? null
}

export function getParallelMinor(major: string): string {
  return major + 'm'
}

// Scale degree intervals in semitones from root (major scale)
const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11]
// Chromatic notes for building chords
const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

function noteToSemitone(note: string): number {
  const enharmonics: Record<string, string> = {
    'Db': 'C#', 'Eb': 'D#', 'Fb': 'E', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#', 'Cb': 'B',
  }
  const n = enharmonics[note] ?? note
  const idx = CHROMATIC.indexOf(n)
  if (idx === -1) throw new Error(`Unknown note for semitone: ${note}`)
  return idx
}

function semitoneToNote(semitone: number, preferFlat = false): string {
  const s = ((semitone % 12) + 12) % 12
  const sharp = CHROMATIC[s]
  if (!preferFlat || !sharp.includes('#')) return sharp
  const flatMap: Record<string, string> = {
    'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb',
  }
  return flatMap[sharp] ?? sharp
}

// Chord qualities per scale degree (1-indexed): M=major, m=minor, dim=diminished
const DEGREE_QUALITY = ['', 'M', 'm', 'm', 'M', 'M', 'm', 'dim']

export function getScaleDegreeChord(major: string, degree: 1 | 2 | 3 | 4 | 5 | 6 | 7): string {
  const preferFlat = ['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb'].includes(major)
  const rootSemitone = noteToSemitone(major)
  const interval = MAJOR_SCALE_INTERVALS[degree - 1]
  const chordRoot = semitoneToNote(rootSemitone + interval, preferFlat)
  const quality = DEGREE_QUALITY[degree]
  if (quality === 'M') return chordRoot
  if (quality === 'm') return chordRoot + 'm'
  return chordRoot + 'dim'
}

export function getDominant(major: string): string {
  return getStepsFrom(major, 1)
}

export function getSubdominant(major: string): string {
  return getStepsFrom(major, -1)
}

export function allMajorKeys(): string[] {
  return CIRCLE.map(e => e.major)
}
