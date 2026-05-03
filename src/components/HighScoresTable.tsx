import type { FC } from 'react'
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table'
import type { HighScoreEntry } from '../lib/types'

const col = createColumnHelper<HighScoreEntry & { rank: number }>()

const columns = [
  col.accessor('rank', { header: '#', cell: i => i.getValue() }),
  col.accessor('name', { header: 'Name' }),
  col.accessor('score', { header: 'Score' }),
  col.accessor('accuracy', { header: 'Accuracy', cell: i => `${i.getValue()}%` }),
  col.accessor('date', { header: 'Date', cell: i => new Date(i.getValue()).toLocaleDateString() }),
]

interface Props { entries: HighScoreEntry[] }

export const HighScoresTable: FC<Props> = ({ entries }) => {
  const data = entries.map((e, i) => ({ ...e, rank: i + 1 }))
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })

  if (entries.length === 0) {
    return <p className="text-center text-gray-400 font-display py-4">No scores yet — play a quiz!</p>
  }

  return (
    <table className="w-full text-sm font-display">
      <thead>
        {table.getHeaderGroups().map(hg => (
          <tr key={hg.id} className="text-left text-purple-700">
            {hg.headers.map(h => (
              <th key={h.id} className="pb-2 font-black">{flexRender(h.column.columnDef.header, h.getContext())}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row, i) => (
          <tr key={row.id} className={i % 2 === 0 ? 'bg-purple-50' : ''}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className="py-2 px-1">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
