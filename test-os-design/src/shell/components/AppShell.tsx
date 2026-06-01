import { useState } from 'react'
import { Menu, X, Radio } from 'lucide-react'
import { MainNav } from './MainNav'
import { UserMenu } from './UserMenu'

interface AppShellProps {
  children: React.ReactNode
  navigationItems?: Array<{ label: string; href: string; isActive?: boolean }>
  activeHref?: string
  user?: { name: string; email?: string; avatarUrl?: string }
  onNavigate?: (href: string) => void
  onLogout?: () => void
  runCount?: number
}

function SidebarContent({
  activeHref,
  onNavigate,
  user,
  onLogout,
  runCount,
}: Omit<AppShellProps, 'children' | 'navigationItems'>) {
  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span
            className="text-base font-semibold text-white tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Test OS
          </span>
        </div>
        <p className="mt-1 text-[10px] font-mono text-zinc-600 pl-4.5">
          independent validation
        </p>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-2 py-3 min-h-0">
        <MainNav activeHref={activeHref} onNavigate={onNavigate} runCount={runCount} />
      </div>

      {/* User menu */}
      <div className="px-2 py-2 border-t border-zinc-800 shrink-0">
        <UserMenu user={user} onLogout={onLogout} />
      </div>
    </div>
  )
}

export function AppShell({
  children,
  activeHref = '/foundation',
  user,
  onNavigate,
  onLogout,
  runCount,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div
      className="flex h-screen bg-zinc-950 overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col">
        <SidebarContent
          activeHref={activeHref}
          onNavigate={(href) => {
            onNavigate?.(href)
          }}
          user={user}
          onLogout={onLogout}
          runCount={runCount}
        />
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-60 flex flex-col">
            <SidebarContent
              activeHref={activeHref}
              onNavigate={(href) => {
                setMobileOpen(false)
                onNavigate?.(href)
              }}
              user={user}
              onLogout={onLogout}
              runCount={runCount}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-950 shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" strokeWidth={1.5} />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            )}
          </button>
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400" strokeWidth={1.5} />
            <span
              className="text-sm font-semibold text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Test OS
            </span>
          </div>
        </div>

        {/* Content area */}
        <main className="flex-1 overflow-auto bg-zinc-950">{children}</main>
      </div>
    </div>
  )
}
