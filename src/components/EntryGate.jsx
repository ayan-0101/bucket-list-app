import { useState } from 'react'

function randomCode() {
  const words = ['atlas', 'ember', 'harbor', 'meadow', 'lantern', 'compass', 'tide', 'orbit']
  const pick = words[Math.floor(Math.random() * words.length)]
  const num = Math.floor(100 + Math.random() * 900)
  return `${pick}-${num}`
}

export default function EntryGate({ onEnter }) {
  const [listId, setListId] = useState('')
  const [name, setName] = useState('')
  const [mode, setMode] = useState('join') // 'join' | 'create'

  function handleCreate() {
    setListId(randomCode())
    setMode('create')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!listId.trim() || !name.trim()) return
    onEnter(listId.trim().toLowerCase(), name.trim())
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <p className="font-display italic text-muted text-sm tracking-widest uppercase mb-2">
            a shared journal
          </p>
          <h1 className="font-display text-5xl text-parchment font-semibold">
            Our Bucket List
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-surfacealt rounded-2xl p-8 space-y-6"
        >
          <div>
            <label className="block text-muted text-xs uppercase tracking-wide mb-2">
              Your name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Khushi"
              className="w-full bg-ink border border-surfacealt rounded-lg px-4 py-3 text-parchment placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-muted text-xs uppercase tracking-wide mb-2">
              Shared list code
            </label>
            <input
              value={listId}
              onChange={(e) => {
                setListId(e.target.value)
                setMode('join')
              }}
              placeholder="e.g. Ayan007"
              className="w-full bg-ink border border-surfacealt rounded-lg px-4 py-3 text-parchment placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <p className="text-muted text-xs mt-2">
              Both of you enter the exact same code to share one list.{' '}
              <button
                type="button"
                onClick={handleCreate}
                className="text-gold underline underline-offset-2 hover:text-parchment"
              >
                Generate a new code
              </button>
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-gold text-ink font-semibold rounded-lg py-3 hover:brightness-110 transition"
          >
            {mode === 'create' ? 'Start our list' : 'Open our list'}
          </button>
        </form>

        <p className="text-center text-muted text-xs mt-6">
          Anyone with the code can view and edit this list, so pick something only the two of you know.
        </p>
      </div>
    </div>
  )
}
