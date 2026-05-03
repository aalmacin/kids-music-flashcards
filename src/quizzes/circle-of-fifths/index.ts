import type { QuizDefinition } from '../../lib/types'
import { generateStepsQuestion } from './generators/steps'
import { generateRelativeKeyQuestion } from './generators/relative-keys'
import { generateOppositeKeyQuestion } from './generators/opposite-keys'
import { generateKeySignatureQuestion } from './generators/key-signatures'
import { generateScaleDegreeQuestion } from './generators/scale-degrees'
import { generateDominantQuestion } from './generators/dominant'
import { generateEnharmonicQuestion } from './generators/enharmonic'
import { generateParallelKeyQuestion } from './generators/parallel-keys'

export const cofQuizzes: QuizDefinition[] = [
  // Individual
  { id: 'cof-steps', title: 'Steps on the Circle', description: 'Navigate clockwise and counterclockwise', category: 'individual', topic: 'Circle of Fifths', generators: [generateStepsQuestion] },
  { id: 'cof-relative', title: 'Relative Keys', description: 'Find the relative major or minor', category: 'individual', topic: 'Circle of Fifths', generators: [generateRelativeKeyQuestion] },
  { id: 'cof-opposite', title: 'Opposite Keys', description: 'Find the key across the circle', category: 'individual', topic: 'Circle of Fifths', generators: [generateOppositeKeyQuestion] },
  { id: 'cof-keysig', title: 'Key Signatures', description: 'Sharps, flats, and accidental names', category: 'individual', topic: 'Circle of Fifths', generators: [generateKeySignatureQuestion] },
  { id: 'cof-degrees', title: 'Scale Degrees & Chords', description: 'ii, iii, IV, V, vi, vii° of any key', category: 'individual', topic: 'Circle of Fifths', generators: [generateScaleDegreeQuestion] },
  { id: 'cof-dominant', title: 'Dominant & Subdominant', description: 'The V and IV chords', category: 'individual', topic: 'Circle of Fifths', generators: [generateDominantQuestion] },
  { id: 'cof-enharmonic', title: 'Enharmonic Equivalents', description: 'Same sound, different name', category: 'individual', topic: 'Circle of Fifths', generators: [generateEnharmonicQuestion] },
  { id: 'cof-parallel', title: 'Parallel Keys', description: 'Major and minor with the same root', category: 'individual', topic: 'Circle of Fifths', generators: [generateParallelKeyQuestion] },
  // Group
  { id: 'cof-navigation', title: 'Navigation', description: 'Steps + Relative + Opposite keys', category: 'group', topic: 'Circle of Fifths', generators: [generateStepsQuestion, generateRelativeKeyQuestion, generateOppositeKeyQuestion] },
  { id: 'cof-keysig-mix', title: 'Key Signatures Mix', description: 'All key signature question types', category: 'group', topic: 'Circle of Fifths', generators: [generateKeySignatureQuestion] },
  { id: 'cof-chords', title: 'Chord Relationships', description: 'Scale degrees, dominant, subdominant', category: 'group', topic: 'Circle of Fifths', generators: [generateScaleDegreeQuestion, generateDominantQuestion] },
  // Master
  { id: 'cof-master', title: 'Circle of Fifths Master', description: 'Every question type — the full challenge!', category: 'master', topic: 'Circle of Fifths', generators: [generateStepsQuestion, generateRelativeKeyQuestion, generateOppositeKeyQuestion, generateKeySignatureQuestion, generateScaleDegreeQuestion, generateDominantQuestion, generateEnharmonicQuestion, generateParallelKeyQuestion] },
]
