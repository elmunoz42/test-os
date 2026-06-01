import {
  FlaskConical,
  Layers,
  FileBarChart2,
  Workflow,
  History,
  Code2,
  Settings,
  HelpCircle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  step?: string
  badge?: number
  isActive?: boolean
}

interface NavGroupProps {
  items: NavItem[]
  onNavigate?: (href: string) => void
}

interface MainNavProps {
  activeHref?: string
  onNavigate?: (href: string) => void
  runCount?: number
}

export const PHASE_ITEMS: Omit<NavItem, 'isActive'>[] = [
  { label: 'Test Foundation', href: '/foundation', icon: FlaskConical, step: '01' },
  { label: 'Section Validation', href: '/validation', icon: Layers, step: '02' },
  { label: 'Verdict & Reporting', href: '/verdict', icon: FileBarChart2, step: '03' },
  { label: 'Deployment & Automation', href: '/deployment', icon: Workflow, step: '04' },
]

export const TOOL_ITEMS: Omit<NavItem, 'isActive'>[] = [
  { label: 'Run History', href: '/runs', icon: History },
  { label: 'Suite Inspector', href: '/inspector', icon: Code2 },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Help / Docs', href: '/help', icon: HelpCircle },
]

function NavGroup({ items, onNavigate }: NavGroupProps) {
  return (
    <nav className="flex flex-col gap-0.5">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <button
            key={item.href}
            onClick={() => onNavigate?.(item.href)}
            className={`
              w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left transition-all group relative
              ${
                item.isActive
                  ? 'bg-cyan-500/10 text-cyan-400'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
              }
            `}
          >
            {item.isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-cyan-400 rounded-r-full" />
            )}
            {item.step ? (
              <span
                className={`text-[10px] font-mono w-5 shrink-0 tabular-nums ${
                  item.isActive ? 'text-cyan-400' : 'text-zinc-600 group-hover:text-zinc-400'
                }`}
              >
                {item.step}
              </span>
            ) : (
              <Icon
                className={`w-4 h-4 shrink-0 ${item.isActive ? 'text-cyan-400' : ''}`}
                strokeWidth={1.5}
              />
            )}
            {item.step && (
              <Icon
                className={`w-3.5 h-3.5 shrink-0 ${item.isActive ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}
                strokeWidth={1.5}
              />
            )}
            <span className="text-sm leading-tight truncate flex-1">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="text-[10px] font-mono bg-violet-500/20 text-violet-400 border border-violet-500/30 px-1.5 py-0.5 rounded-full shrink-0">
                {item.badge}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}

export function MainNav({ activeHref = '/foundation', onNavigate, runCount }: MainNavProps) {
  const phases = PHASE_ITEMS.map((item) => ({ ...item, isActive: item.href === activeHref }))
  const tools = TOOL_ITEMS.map((item) => ({
    ...item,
    isActive: item.href === activeHref,
    badge: item.href === '/runs' && runCount ? runCount : undefined,
  }))

  return (
    <div className="flex flex-col gap-1">
      <p className="px-3 mb-1 text-[10px] font-mono uppercase tracking-widest text-zinc-600">
        Phases
      </p>
      <NavGroup items={phases} onNavigate={onNavigate} />

      <div className="my-3 border-t border-zinc-800" />

      <NavGroup items={tools} onNavigate={onNavigate} />
    </div>
  )
}
