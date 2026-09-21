import { useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, Compass } from 'lucide-react'
import { navGroups } from '@/lib/nav-config'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  focusPageHeading,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  // Set right before setOpen(false) on an actual navigation click, so the
  // close-focus handler below can send focus to the newly loaded page's
  // <h1> instead of sheet.tsx's default fallback, which would otherwise
  // return focus to the hamburger button (still in the DOM after every
  // navigation) and strand keyboard/screen-reader users in the header.
  const navigatedRef = useRef(false)

  const handleNavigate = () => {
    navigatedRef.current = true
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:hidden">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Compass className="size-4" />
        </div>
        <span className="font-heading text-base font-semibold">Travix</span>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            aria-label="Menü öffnen"
            className="flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-accent/10"
          >
            <Menu className="size-5" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[280px] bg-sidebar p-0 text-sidebar-foreground"
          onCloseAutoFocus={(event) => {
            if (!navigatedRef.current) return
            navigatedRef.current = false
            event.preventDefault()
            focusPageHeading()
          }}
        >
          <SheetHeader className="border-b border-sidebar-border px-4 py-4">
            <SheetTitle className="font-heading text-sidebar-foreground">Travix</SheetTitle>
          </SheetHeader>
          <nav className="space-y-6 overflow-y-auto px-3 py-4">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-3 pb-1 text-xs font-medium uppercase tracking-wider text-sidebar-foreground/50">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      onClick={handleNavigate}
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
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
