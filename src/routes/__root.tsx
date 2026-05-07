import { createRootRoute, Outlet, Link } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 font-display">
      <header className="bg-purple-600 text-white px-4 py-3 flex items-center justify-between shadow-lg">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Link to={'/' as any} className="text-xl font-black tracking-tight">🎵 Music Flashcards</Link>
        <div className="flex gap-3 text-sm font-bold">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link to={'/scores' as any} className="opacity-80 hover:opacity-100">Scores</Link>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Link to={'/settings' as any} className="opacity-80 hover:opacity-100">Settings</Link>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  ),
})
