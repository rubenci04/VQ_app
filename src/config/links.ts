/** Registro centralizado de enlaces externos. Ningún componente debe hardcodear URLs. */
export const LINKS = {
  comuna: {
    facebook: 'https://www.facebook.com/comunavillaquinteros/',
  },
  radios: {
    sanMartin: 'https://sanmartinfm.com.ar/',
    frecuenciaIes: 'https://www.facebook.com/FrecuenciaIES',
  },
  transport: {
    reference: 'https://colectivostucuman.com.ar/',
    concepcion: 'https://colectivostucuman.com.ar/',
  },
} as const

/** Enlaces a mapas externos. El texto se codifica; nunca se envían datos personales. */
const enc = encodeURIComponent
export const mapLinks = {
  search: (query: string) => `https://www.google.com/maps/search/?api=1&query=${enc(query)}`,
  directions: (destination: string) => `https://www.google.com/maps/dir/?api=1&destination=${enc(destination)}`,
  openStreetMap: (query: string) => `https://www.openstreetmap.org/search?query=${enc(query)}`,
}

export type LinkRegistry = typeof LINKS

export function allExternalLinks(): string[] {
  return Object.values(LINKS).flatMap((group) => Object.values(group))
}
