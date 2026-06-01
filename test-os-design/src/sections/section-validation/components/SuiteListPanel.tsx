import { useState } from 'react'
import { Search, CheckCircle2, Camera, ChevronDown } from 'lucide-react'
import type {
  Epic,
  SectionSuite,
  SuiteFilter,
  SuiteStatus,
  Priority,
} from '@/../product/sections/section-validation/types'

interface SuiteListPanelProps {
  epics: Epic[]
  suites: SectionSuite[]
  activeSuiteId: string | null
  filter: SuiteFilter
  onSelectSuite?: (suiteId: string) => void
  onFilterChange?: (filter: SuiteFilter) => void
}

function priorityDot(priority: Priority) {
  const colors: Record<Priority, string> = {
    high: 'bg-red-500',
    medium: 'bg-amber-500',
    low: 'bg-zinc-500',
  }
  return <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${colors[priority]}`} />
}

function completionBadge(steps: SectionSuite['steps'], status: SuiteStatus) {
  if (status === 'complete') {
    return (
      <span className="flex items-center gap-0.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
      </span>
    )
  }
  const done = steps.filter((s) => s.status === 'complete').length
  const color = done >= 3 ? 'text-cyan-400' : done >= 1 ? 'text-zinc-400' : 'text-zinc-600'
  return (
    <span
      className={`text-[10px] font-mono tabular-nums ${color}`}
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      {done}/4
    </span>
  )
}

function formatDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

interface EpicGroupProps {
  epic: Epic
  suites: SectionSuite[]
  activeSuiteId: string | null
  onSelectSuite?: (suiteId: string) => void
}

function EpicGroup({ epic, suites, activeSuiteId, onSelectSuite }: EpicGroupProps) {
  const [collapsed, setCollapsed] = useState(false)

  if (suites.length === 0) return null

  return (
    <div>
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center gap-1.5 px-3 py-1.5 hover:bg-zinc-800/30 transition-colors group"
      >
        <ChevronDown
          className={`w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-transform ${collapsed ? '-rotate-90' : ''}`}
          strokeWidth={2}
        />
        <span
          className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 group-hover:text-zinc-400 transition-colors truncate"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {epic.name}
        </span>
        <span
          className="ml-auto text-[9px] font-mono text-zinc-700"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {suites.filter((s) => s.status === 'complete').length}/{suites.length}
        </span>
      </button>

      {!collapsed && (
        <div className="flex flex-col">
          {suites.map((suite) => {
            const isActive = suite.id === activeSuiteId
            const hasCamera = suite.steps.find((s) => s.id === 'capture-evidence')?.status === 'complete'

            return (
              <button
                key={suite.id}
                onClick={() => onSelectSuite?.(suite.id)}
                className={`
                  w-full flex items-start gap-2.5 px-3 py-2 text-left transition-all relative group
                  ${isActive
                    ? 'bg-cyan-500/8 text-zinc-100'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                  }
                `}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan-400 rounded-r-full" />
                )}

                <div className="flex items-center gap-1.5 mt-0.5 shrink-0">
                  {priorityDot(suite.priority)}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-[12px] font-medium leading-tight truncate ${isActive ? 'text-zinc-100' : 'text-zinc-300'}`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {suite.name}
                  </p>
                  {suite.lastModifiedAt && (
                    <p
                      className="text-[9px] text-zinc-600 mt-0.5"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {formatDate(suite.lastModifiedAt)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                  {hasCamera && (
                    <Camera className="w-2.5 h-2.5 text-violet-500 opacity-60" strokeWidth={1.5} />
                  )}
                  {completionBadge(suite.steps, suite.status)}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function SuiteListPanel({
  epics,
  suites,
  activeSuiteId,
  filter,
  onSelectSuite,
  onFilterChange,
}: SuiteListPanelProps) {
  const statusOptions: { value: SuiteStatus | ''; label: string }[] = [
    { value: '', label: 'All statuses' },
    { value: 'in_progress', label: 'In progress' },
    { value: 'not_started', label: 'Not started' },
    { value: 'complete', label: 'Complete' },
  ]

  const filteredSuites = suites.filter((s) => {
    const matchesQuery =
      !filter.query || s.name.toLowerCase().includes(filter.query.toLowerCase())
    const matchesEpic = !filter.epicId || s.epicId === filter.epicId
    const matchesStatus = !filter.status || s.status === filter.status
    return matchesQuery && matchesEpic && matchesStatus
  })

  const completedCount = suites.filter((s) => s.status === 'complete').length

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Panel header */}
      <div className="px-3 pt-4 pb-2 border-b border-zinc-800/60 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[10px] font-bold uppercase tracking-widest text-zinc-500"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Suites
          </span>
          <span
            className="text-[10px] font-mono text-zinc-600"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {completedCount}/{suites.length} done
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-600" strokeWidth={2} />
          <input
            type="text"
            value={filter.query}
            onChange={(e) => onFilterChange?.({ ...filter, query: e.target.value })}
            placeholder="Search sections..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-md pl-7 pr-3 py-1.5 text-xs text-zinc-300 placeholder:text-zinc-600
              focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/10 transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1.5">
          <select
            value={filter.epicId ?? ''}
            onChange={(e) => onFilterChange?.({ ...filter, epicId: e.target.value || null })}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-400
              focus:outline-none focus:border-cyan-500/50 transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <option value="">All epics</option>
            {epics.map((epic) => (
              <option key={epic.id} value={epic.id} className="bg-zinc-900">
                {epic.name}
              </option>
            ))}
          </select>
          <select
            value={filter.status ?? ''}
            onChange={(e) =>
              onFilterChange?.({
                ...filter,
                status: (e.target.value as SuiteStatus) || null,
              })
            }
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-400
              focus:outline-none focus:border-cyan-500/50 transition-colors"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-zinc-900">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Suite list */}
      <div className="flex-1 overflow-y-auto">
        {filteredSuites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-24 px-4 text-center">
            <p className="text-xs text-zinc-600" style={{ fontFamily: "'Inter', sans-serif" }}>
              No suites match your filter
            </p>
          </div>
        ) : (
          <div className="py-1">
            {epics.map((epic) => {
              const epicSuites = filteredSuites.filter((s) => s.epicId === epic.id)
              return (
                <EpicGroup
                  key={epic.id}
                  epic={epic}
                  suites={epicSuites}
                  activeSuiteId={activeSuiteId}
                  onSelectSuite={onSelectSuite}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
