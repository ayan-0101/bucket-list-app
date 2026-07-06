import { useState } from 'react'

const TIMEFRAMES = ['Someday', 'This year', 'Next year']

export default function AddItemForm({ categories, initial, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [category, setCategory] = useState(initial?.category || categories[0])
  const [timeframe, setTimeframe] = useState(initial?.timeframe || TIMEFRAMES[0])
  const [notes, setNotes] = useState(initial?.notes || '')

  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || submitting) return
    setSubmitting(true)
    try {
      await onSubmit({ title: title.trim(), category, timeframe, notes: notes.trim() })
      if (!initial) {
        setTitle('')
        setCategory(categories[0])
        setTimeframe(TIMEFRAMES[0])
        setNotes('')
      }
    } catch (err) {
      console.error('Failed to save item:', err)
      alert('Could not save — check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-surfacealt rounded-2xl p-6 mb-6 space-y-4"
    >
      <div>
        <label className="block text-muted text-xs uppercase tracking-wide mb-2">
          What do you want to do?
        </label>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. See the northern lights"
          className="w-full bg-ink border border-surfacealt rounded-lg px-4 py-3 text-parchment placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-gold"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-muted text-xs uppercase tracking-wide mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-ink border border-surfacealt rounded-lg px-4 py-3 text-parchment focus:outline-none focus:ring-2 focus:ring-gold"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-muted text-xs uppercase tracking-wide mb-2">When</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full bg-ink border border-surfacealt rounded-lg px-4 py-3 text-parchment focus:outline-none focus:ring-2 focus:ring-gold"
          >
            {TIMEFRAMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-muted text-xs uppercase tracking-wide mb-2">
          Notes <span className="normal-case text-muted/70">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Any details worth remembering"
          className="w-full bg-ink border border-surfacealt rounded-lg px-4 py-3 text-parchment placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="text-muted text-sm px-4 py-2 hover:text-parchment"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="bg-gold text-ink font-semibold rounded-full px-5 py-2 text-sm hover:brightness-110 transition disabled:opacity-60"
        >
          {submitting ? 'Saving…' : initial ? 'Save changes' : 'Add to the list'}
        </button>
      </div>
    </form>
  )
}