import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { usePlayerName } from '../hooks/usePlayerName'
import { useHighScores } from '../hooks/useHighScores'

export const Route = createFileRoute('/settings')({
  component: SettingsScreen,
})

function SettingsScreen() {
  const { name, saveName, removeName } = usePlayerName()
  const { clearScores } = useHighScores()
  const [input, setInput] = useState(name ?? '')
  const [saved, setSaved] = useState(false)
  const [confirming, setConfirming] = useState(false)

  function handleSave() {
    if (input.trim()) {
      saveName(input.trim())
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  function handleClearName() {
    removeName()
    setInput('')
  }

  function handleClearScores() {
    clearScores()
    setConfirming(false)
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-black text-purple-700">Settings</h1>

      <section className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="font-black text-lg text-gray-700">Player Name</h2>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter your name"
          maxLength={20}
          className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:border-purple-500"
        />
        <div className="flex gap-3">
          <button onClick={handleSave} className="bg-purple-600 text-white font-bold rounded-xl px-5 py-2 hover:bg-purple-700">
            {saved ? 'Saved!' : 'Save Name'}
          </button>
          {name && (
            <button onClick={handleClearName} className="text-red-500 font-bold rounded-xl px-5 py-2 hover:bg-red-50">
              Clear Name
            </button>
          )}
        </div>
      </section>

      <section className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <h2 className="font-black text-lg text-gray-700">High Scores</h2>
        {confirming ? (
          <div className="space-y-3">
            <p className="text-red-600 font-bold">Are you sure? This will delete all high scores.</p>
            <div className="flex gap-3">
              <button onClick={handleClearScores} className="bg-red-500 text-white font-bold rounded-xl px-5 py-2">Yes, clear all</button>
              <button onClick={() => setConfirming(false)} className="text-gray-500 font-bold px-5 py-2">Cancel</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setConfirming(true)} className="text-red-500 font-bold rounded-xl px-5 py-2 hover:bg-red-50">
            Clear All High Scores
          </button>
        )}
      </section>
    </div>
  )
}
