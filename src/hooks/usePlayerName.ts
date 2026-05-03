import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPlayerName, setPlayerName, clearPlayerName } from '../lib/storage'

export function usePlayerName() {
  const qc = useQueryClient()

  const { data: name } = useQuery({
    queryKey: ['playerName'],
    queryFn: getPlayerName,
    staleTime: Infinity,
  })

  const { mutate: saveName } = useMutation({
    mutationFn: async (n: string) => { setPlayerName(n); return n },
    onSuccess: (n) => qc.setQueryData(['playerName'], n),
  })

  const { mutate: removeName } = useMutation({
    mutationFn: async () => { clearPlayerName(); return null },
    onSuccess: () => qc.setQueryData(['playerName'], null),
  })

  return { name: name ?? null, saveName, removeName }
}
