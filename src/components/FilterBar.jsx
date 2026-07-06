export const SORT_OPTIONS = [
  ['newest', 'Newest first'],
  ['oldest', 'Oldest first'],
  ['az', 'Title A–Z'],
  ['za', 'Title Z–A'],
]

export default function FilterBar({
  categories,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search your list…"
        className="bg-surface border border-surfacealt rounded-full px-4 py-2 text-sm text-parchment placeholder-muted/60 focus:outline-none focus:ring-2 focus:ring-gold w-full sm:w-48"
      />

      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
        className="bg-surface border border-surfacealt rounded-full px-4 py-2 text-sm text-parchment focus:outline-none focus:ring-2 focus:ring-gold"
      >
        <option value="All">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="bg-surface border border-surfacealt rounded-full px-4 py-2 text-sm text-parchment focus:outline-none focus:ring-2 focus:ring-gold"
      >
        {SORT_OPTIONS.map(([val, label]) => (
          <option key={val} value={val}>
            {label}
          </option>
        ))}
      </select>

      <div className="flex bg-surface border border-surfacealt rounded-full p-1 text-sm">
        {[
          ['active', 'To do'],
          ['done', 'Done'],
          ['all', 'All'],
        ].map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilterStatus(val)}
            className={`px-3 py-1.5 rounded-full transition ${
              filterStatus === val ? 'bg-gold text-ink font-semibold' : 'text-muted hover:text-parchment'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}