import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getHighScores, saveHighScore, clearHighScores, modeKey } from '../lib/storage'
import type { HighScoreEntry, QuizMode } from '../lib/types'

export function useHighScores(quizId?: string) {
  const qc = useQueryClient()

  const { data: allScores } = useQuery({
    queryKey: ['highScores'],
    queryFn: getHighScores,
    staleTime: Infinity,
  })

  const quizScores = quizId ? (allScores?.[quizId] ?? {}) : {}

  const { mutate: addScore } = useMutation({
    mutationFn: async ({ mode, entry }: { mode: QuizMode; entry: HighScoreEntry }) => {
      const stored = saveHighScore(quizId!, modeKey(mode), entry)
      return { scores: getHighScores(), stored }
    },
    onSuccess: ({ scores }) => qc.setQueryData(['highScores'], scores),
  })

  const { mutate: clearScores } = useMutation({
    mutationFn: async () => { clearHighScores(); return {} },
    onSuccess: () => qc.setQueryData(['highScores'], {}),
  })

  return { allScores: allScores ?? {}, quizScores, addScore, clearScores }
}
