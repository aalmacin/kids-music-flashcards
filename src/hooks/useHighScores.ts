import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getHighScores, saveHighScore, clearHighScores, modeKey } from '../lib/storage'
import type { HighScoreEntry, QuizMode, Difficulty } from '../lib/types'

export function useHighScores(quizId?: string) {
  const qc = useQueryClient()

  const { data: allScores } = useQuery({
    queryKey: ['highScores'],
    queryFn: getHighScores,
    staleTime: Infinity,
  })

  const quizScores = quizId ? (allScores?.[quizId] ?? {}) : {}

  const { mutate: addScore } = useMutation({
    mutationFn: async ({ mode, difficulty, entry }: { mode: QuizMode; difficulty: Difficulty; entry: HighScoreEntry }) => {
      saveHighScore(quizId!, modeKey(mode), difficulty, entry)
      return getHighScores()
    },
    onSuccess: (scores) => qc.setQueryData(['highScores'], scores),
  })

  const { mutate: clearScores } = useMutation({
    mutationFn: async () => { clearHighScores(); return {} },
    onSuccess: () => qc.setQueryData(['highScores'], {}),
  })

  return { allScores: allScores ?? {}, quizScores, addScore, clearScores }
}
