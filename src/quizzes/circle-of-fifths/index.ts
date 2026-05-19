import type { QuizDefinition } from '../../lib/types'
import { enumerateStepsQuestions } from './generators/steps'
import { enumerateRelativeKeyQuestions } from './generators/relative-keys'
import { enumerateOppositeKeyQuestions } from './generators/opposite-keys'
import { enumerateKeySignatureQuestions } from './generators/key-signatures'
import { enumerateScaleDegreeQuestions } from './generators/scale-degrees'
import { enumerateDominantQuestions } from './generators/dominant'
import { enumerateEnharmonicQuestions } from './generators/enharmonic'
import { enumerateParallelKeyQuestions } from './generators/parallel-keys'

export const cofQuizzes: QuizDefinition[] = [
  // Individual
  { id: 'cof-steps', title: 'Steps on the Circle', description: 'Navigate clockwise and counterclockwise', category: 'individual', topic: 'Circle of Fifths', generators: [enumerateStepsQuestions] },
  { id: 'cof-relative', title: 'Relative Keys', description: 'Find the relative major or minor', category: 'individual', topic: 'Circle of Fifths', generators: [enumerateRelativeKeyQuestions] },
  { id: 'cof-opposite', title: 'Opposite Keys', description: 'Find the key across the circle', category: 'individual', topic: 'Circle of Fifths', generators: [enumerateOppositeKeyQuestions] },
  { id: 'cof-keysig', title: 'Key Signatures', description: 'Sharps, flats, and accidental names', category: 'individual', topic: 'Circle of Fifths', generators: [enumerateKeySignatureQuestions] },
  { id: 'cof-degrees', title: 'Scale Degrees & Chords', description: 'ii, iii, IV, V, vi, vii° of any key', category: 'individual', topic: 'Circle of Fifths', generators: [enumerateScaleDegreeQuestions] },
  { id: 'cof-dominant', title: 'Dominant & Subdominant', description: 'The V and IV chords', category: 'individual', topic: 'Circle of Fifths', generators: [enumerateDominantQuestions] },
  { id: 'cof-enharmonic', title: 'Enharmonic Equivalents', description: 'Same sound, different name', category: 'individual', topic: 'Circle of Fifths', generators: [enumerateEnharmonicQuestions] },
  { id: 'cof-parallel', title: 'Parallel Keys', description: 'Major and minor with the same root', category: 'individual', topic: 'Circle of Fifths', generators: [enumerateParallelKeyQuestions] },
  // Group
  { id: 'cof-navigation', title: 'Navigation', description: 'Steps + Relative + Opposite keys', category: 'group', topic: 'Circle of Fifths', generators: [enumerateStepsQuestions, enumerateRelativeKeyQuestions, enumerateOppositeKeyQuestions] },
  { id: 'cof-keysig-mix', title: 'Key Signatures Mix', description: 'All key signature question types', category: 'group', topic: 'Circle of Fifths', generators: [enumerateKeySignatureQuestions] },
  { id: 'cof-chords', title: 'Chord Relationships', description: 'Scale degrees, dominant, subdominant', category: 'group', topic: 'Circle of Fifths', generators: [enumerateScaleDegreeQuestions, enumerateDominantQuestions] },
  // Master
  { id: 'cof-master', title: 'Circle of Fifths Master', description: 'Every question type — the full challenge!', category: 'master', topic: 'Circle of Fifths', generators: [enumerateStepsQuestions, enumerateRelativeKeyQuestions, enumerateOppositeKeyQuestions, enumerateKeySignatureQuestions, enumerateScaleDegreeQuestions, enumerateDominantQuestions, enumerateEnharmonicQuestions, enumerateParallelKeyQuestions] },
]
