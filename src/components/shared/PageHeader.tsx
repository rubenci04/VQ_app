import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export function PageHeader({ icon: Icon, title, subtitle, children }: { icon: LucideIcon; title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <header className="animate-rise mb-5 flex items-start gap-3">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-orange text-orange-foreground shadow-sm">
        <Icon className="size-6" aria-hidden />
      </span>
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-extrabold leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        {children}
      </div>
    </header>
  )
}

export function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="animate-rise mb-7" aria-label={title}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold"><span className="h-5 w-1.5 rounded-full bg-orange-bright" aria-hidden />{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}
