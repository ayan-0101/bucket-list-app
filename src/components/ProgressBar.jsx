export default function ProgressBar({ total, done }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <p className="text-muted text-xs uppercase tracking-wide">Progress</p>
        <p className="text-parchment text-sm">
          {done} of {total} done &middot; {pct}%
        </p>
      </div>
      <div className="w-full h-2 bg-surfacealt rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold to-rose transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
