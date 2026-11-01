import { Moon, Sun } from 'lucide-react'
import { Suspense } from 'react'
import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { LoadingState } from '@/components/shared/States'
import { APP } from '@/config/app'
import { BOTTOM_NAV, NAV_ITEMS } from '@/config/nav'
import { cn } from '@/lib/utils'
import { useTheme } from '@/services/theme'

function Brand() {
  return (
    <NavLink to="/" className="flex items-center gap-2.5" aria-label="VQ App, ir al inicio">
      <img src="/brand/logo-mark-v3.png" alt="Logo de Villa Quinteros" className="size-12 rounded-xl bg-white object-contain p-1" width={48} height={48} />
      <span className="font-display text-lg font-extrabold leading-none">
        VQ <span className="text-primary">App</span>
      </span>
    </NavLink>
  )
}

function ThemeToggle() {
  const { isDark, toggle } = useTheme()
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="grid size-11 cursor-pointer place-items-center rounded-full text-foreground transition hover:bg-muted active:scale-95"
    >
      {isDark ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
    </button>
  )
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition',
    isActive ? 'bg-orange text-orange-foreground shadow-sm' : 'text-foreground hover:bg-orange-soft',
  )

/** Una notificación tocada con la app ya abierta pide al router ir al contenido exacto (mensaje del service worker). */
function useNotificationNavigation() {
  const navigate = useNavigate()
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    const onMessage = (e: MessageEvent) => {
      const d = e.data as { type?: string; url?: string } | null
      if (d?.type !== 'rsc-open' || typeof d.url !== 'string') return
      const u = new URL(d.url, window.location.origin)
      if (u.origin === window.location.origin) void navigate(u.pathname + u.search)
    }
    navigator.serviceWorker.addEventListener('message', onMessage)
    return () => navigator.serviceWorker.removeEventListener('message', onMessage)
  }, [navigate])
}

export function AppShell() {
  const { pathname } = useLocation()
  useNotificationNavigation()
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[17rem_1fr]">
      <aside className="hidden border-r-2 border-orange-bright/35 bg-gradient-to-b from-orange-wash via-card to-accent-soft p-5 md:sticky md:top-0 md:flex md:h-dvh md:flex-col md:gap-6">
        <Brand />
        <nav aria-label="Secciones" className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
              <Icon className="size-5" aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
          <span>v{APP.version}</span>
          <ThemeToggle />
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-orange-bright/50 bg-orange-wash/90 px-4 py-2 backdrop-blur md:hidden">
          <Brand />
          <ThemeToggle />
        </header>

        <main id="contenido" className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-5 md:px-8 md:pb-12 md:pt-8" key={pathname}>
          <Suspense fallback={<LoadingState />}>
            <Outlet />
          </Suspense>
        </main>

        <footer className="mx-auto hidden w-full max-w-3xl px-8 pb-8 text-xs text-muted-foreground md:block">{APP.disclaimer}</footer>
      </div>

      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-orange-bright/40 bg-orange-wash/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {BOTTOM_NAV.map(({ to, label, short, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-16 flex-col items-center justify-center gap-1 text-[0.7rem] font-semibold transition',
                    isActive ? 'text-orange' : 'text-muted-foreground',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={cn('grid h-7 w-14 place-items-center rounded-full transition', isActive && 'bg-orange-soft')}>
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span aria-label={label}>{short ?? label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
