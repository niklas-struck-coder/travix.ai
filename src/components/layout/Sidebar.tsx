import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ChevronsLeft, ChevronsRight, Compass } from 'lucide-react'
import { navGroups } from '@/lib/nav-config'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 lg:flex',
        collapsed ? 'w-[76px]' : 'w-[260px]',
      )}
    >
      <div className="flex h-16 items-center gap-2 px-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Compass className="size-5" />
        </div>
        {!collapsed && <span className="font-heading text-lg font-semibold tracking-tight">Travix</span>}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  title={collapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                    )
                  }
                >
                  <item.icon className="size-4.5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <button
        onClick={() => setCollapsed((value) => !value)}
        aria-label={collapsed ? 'Seitenleiste ausklappen' : 'Seitenleiste einklappen'}
        className="flex items-center gap-2 border-t border-sidebar-border px-4 py-3 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground"
      >
        {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
        {!collapsed && 'Einklappen'}
      </button>
    </aside>
  )
}
