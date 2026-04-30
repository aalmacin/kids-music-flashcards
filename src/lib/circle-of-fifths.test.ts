import { describe, it, expect } from 'vitest'
import {
  CIRCLE,
  getStepsFrom,
  getRelativeMinor,
  getOppositeKey,
  getKeySignature,
  getEnharmonic,
  getParallelMinor,
  getScaleDegreeChord,
  getDominant,
  getSubdominant,
  sharpsOrder,
  flatsOrder,
} from './circle-of-fifths'

describe('CIRCLE', () => {
  it('has 12 entries', () => expect(CIRCLE).toHaveLength(12))
  it('starts with C', () => expect(CIRCLE[0].major).toBe('C'))
  it('has G at index 1', () => expect(CIRCLE[1].major).toBe('G'))
})

describe('getStepsFrom', () => {
  it('returns G for 1 step right of C', () => expect(getStepsFrom('C', 1)).toBe('G'))
  it('returns F for 1 step left of C (−1)', () => expect(getStepsFrom('C', -1)).toBe('F'))
  it('wraps around: 12 steps from C returns C', () => expect(getStepsFrom('C', 12)).toBe('C'))
  it('returns Bb for 2 steps left of C', () => expect(getStepsFrom('C', -2)).toBe('Bb'))
})

describe('getRelativeMinor', () => {
  it('returns Am for C', () => expect(getRelativeMinor('C')).toBe('Am'))
  it('returns Em for G', () => expect(getRelativeMinor('G')).toBe('Em'))
  it('returns F#m for A', () => expect(getRelativeMinor('A')).toBe('F#m'))
})

describe('getOppositeKey', () => {
  it('returns F# for C', () => expect(getOppositeKey('C')).toBe('F#/Gb'))
  it('returns C for F#', () => expect(getOppositeKey('F#')).toBe('C'))
})

describe('getKeySignature', () => {
  it('C has 0 accidentals', () => expect(getKeySignature('C')).toEqual({ count: 0, type: null, notes: [] }))
  it('G has 1 sharp', () => expect(getKeySignature('G')).toEqual({ count: 1, type: 'sharp', notes: ['F#'] }))
  it('F has 1 flat', () => expect(getKeySignature('F')).toEqual({ count: 1, type: 'flat', notes: ['Bb'] }))
  it('Bb has 2 flats', () => expect(getKeySignature('Bb')).toEqual({ count: 2, type: 'flat', notes: ['Bb', 'Eb'] }))
})

describe('getEnharmonic', () => {
  it('returns Gb for F#', () => expect(getEnharmonic('F#')).toBe('Gb'))
  it('returns F# for Gb', () => expect(getEnharmonic('Gb')).toBe('F#'))
  it('returns null for C', () => expect(getEnharmonic('C')).toBeNull())
})

describe('getParallelMinor', () => {
  it('returns Cm for C', () => expect(getParallelMinor('C')).toBe('Cm'))
  it('returns Gm for G', () => expect(getParallelMinor('G')).toBe('Gm'))
})

describe('getScaleDegreeChord', () => {
  it('ii of C is Dm', () => expect(getScaleDegreeChord('C', 2)).toBe('Dm'))
  it('V of C is G', () => expect(getScaleDegreeChord('C', 5)).toBe('G'))
  it('vii of C is Bdim', () => expect(getScaleDegreeChord('C', 7)).toBe('Bdim'))
  it('iii of D is F#m', () => expect(getScaleDegreeChord('D', 3)).toBe('F#m'))
})

describe('getDominant', () => {
  it('dominant of C is G', () => expect(getDominant('C')).toBe('G'))
  it('dominant of G is D', () => expect(getDominant('G')).toBe('D'))
})

describe('getSubdominant', () => {
  it('subdominant of C is F', () => expect(getSubdominant('C')).toBe('F'))
  it('subdominant of G is C', () => expect(getSubdominant('G')).toBe('C'))
})

describe('sharpsOrder', () => {
  it('is F# C# G# D# A# E# B#', () =>
    expect(sharpsOrder).toEqual(['F#', 'C#', 'G#', 'D#', 'A#', 'E#', 'B#']))
})

describe('flatsOrder', () => {
  it('is Bb Eb Ab Db Gb Cb Fb', () =>
    expect(flatsOrder).toEqual(['Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb', 'Fb']))
})
