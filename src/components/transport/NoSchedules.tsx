import { BusFront } from 'lucide-react'
import { EmptyState } from '@/components/shared/States'
import { ExternalLink } from '@/components/shared/ExternalLink'
import { LINKS } from '@/config/links'

/** La fuente importada no permite confirmar un horario para este tramo. */
export function NoSchedules({ localityName, referenceUrl }: { localityName: string; referenceUrl?: string }) {
  return (
    <EmptyState icon={BusFront} title={`Sin horario cargado entre Villa Quinteros y ${localityName}`}>
      <p>
        La fuente importada no aporta un recorrido con horarios compatibles para este trayecto desde Villa Quinteros.
        Puede requerir combinar o usar otra empresa. Consultá la fuente y confirmá con la empresa antes de viajar.
      </p>
      <p className="mt-3">
        Podés consultar la fuente original:
        <br />
        <ExternalLink href={referenceUrl ?? LINKS.transport.reference} className="mt-1 font-semibold text-accent underline underline-offset-2">
          Ver horarios en Colectivos Tucumán
        </ExternalLink>
      </p>
    </EmptyState>
  )
}
