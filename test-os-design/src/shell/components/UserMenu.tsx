import { useState } from 'react'
import { LogOut, ChevronUp } from 'lucide-react'

interface UserMenuProps {
  user?: { name: string; email?: string; avatarUrl?: string }
  onLogout?: () => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false)

  if (!user) return null

  return (
    <div className="relative">
      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-1 bg-zinc-900 border border-zinc-700 rounded-md shadow-xl overflow-hidden">
          <button
            onClick={() => {
              setOpen(false)
              onLogout?.()
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md hover:bg-zinc-800 transition-colors group"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-6 h-6 rounded-full shrink-0 object-cover"
          />
        ) : (
          <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-semibold text-cyan-400 font-mono">
              {getInitials(user.name)}
            </span>
          </span>
        )}
        <div className="flex-1 min-w-0 text-left">
          <p className="text-xs font-medium text-zinc-200 truncate leading-tight">{user.name}</p>
          {user.email && (
            <p className="text-[10px] text-zinc-500 truncate leading-tight mt-0.5">{user.email}</p>
          )}
        </div>
        <ChevronUp
          className={`w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-all ${open ? 'rotate-0' : 'rotate-180'}`}
          strokeWidth={1.5}
        />
      </button>
    </div>
  )
}
