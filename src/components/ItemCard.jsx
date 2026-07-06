import { useState } from 'react'

function formatDate(ts) {
  if (!ts?.toDate) return ''
  return ts.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ItemCard({ item, onToggle, onEdit, onDelete }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  return (
    <div
      className={`ticket-edge relative bg-surface border border-surfacealt rounded-2xl pl-8 pr-6 py-5 flex items-start gap-4 ${
        item.completed ? 'opacity-70' : ''
      }`}
    >
      <button
        onClick={onToggle}
        aria-label={item.completed ? 'Mark as not done' : 'Mark as done'}
        className={`mt-1 w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
          item.completed ? 'border-sage bg-sage/20' : 'border-muted hover:border-gold'
        }`}
      >
        {item.completed && <span className="text-sage text-xs">✓</span>}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-xs uppercase tracking-wide text-gold">{item.category}</span>
          <span className="text-xs text-muted">&middot; {item.timeframe}</span>
        </div>
        <p
          className={`font-display text-xl text-parchment ${
            item.completed ? 'line-through decoration-muted' : ''
          }`}
        >
          {item.title}
        </p>
        {item.notes && <p className="text-muted text-sm mt-1">{item.notes}</p>}
        <p className="text-muted text-xs mt-2">
          Added by {item.addedBy}
          {item.completed && item.completedBy && (
            <> &middot; completed by {item.completedBy} {formatDate(item.completedAt) && `on ${formatDate(item.completedAt)}`}</>
          )}
        </p>
      </div>

      {item.completed && (
        <div className="stamp hidden sm:flex w-16 h-16 flex-shrink-0 items-center justify-center text-[10px] font-bold uppercase tracking-wider text-center leading-tight">
          Done
        </div>
      )}

      <div className="flex flex-col gap-2 flex-shrink-0">
        <button
          onClick={onEdit}
          className="text-muted text-xs hover:text-parchment"
          aria-label="Edit"
        >
          Edit
        </button>
        {confirmingDelete ? (
          <div className="flex flex-col gap-1 items-end">
            <button
              onClick={onDelete}
              className="text-rose text-xs font-semibold hover:brightness-110"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="text-muted text-xs hover:text-parchment"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingDelete(true)}
            className="text-muted text-xs hover:text-rose"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
