/**
 * Configuración del mapa. El proveedor de teselas es reemplazable: basta cambiar este objeto o definir
 * las variables VITE_MAP_TILES_URL / VITE_MAP_ATTRIBUTION / VITE_MAP_PROVIDER_NAME al compilar.
 *
 * Política de uso de OpenStreetMap (https://operations.osmfoundation.org/policies/tiles/): sin descargas masivas,
 * sin precarga ni mapas offline desde los servidores públicos, atribución visible y uso moderado. Por eso el
 * mapa limita el zoom/área y el service worker NO guarda teselas.
 */
export interface TileProvider {
  id: string
  name: string
  url: string
  attribution: string
  minZoom: number
  maxZoom: number
  /** Condiciones de uso, visibles en la pantalla «Acerca de». */
  termsUrl: string
}

const env = import.meta.env as Record<string, string | undefined>

export const TILE_PROVIDER: TileProvider = {
  id: 'osm',
  name: env.VITE_MAP_PROVIDER_NAME || 'OpenStreetMap',
  url: env.VITE_MAP_TILES_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution:
    env.VITE_MAP_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">Colaboradores de OpenStreetMap</a>',
  minZoom: 13,
  maxZoom: 18,
  termsUrl: 'https://operations.osmfoundation.org/policies/tiles/',
}

/** Localidad de Villa Quinteros (coordenadas de Gobiernos Locales; límites aproximados del visor). */
export const TOWN = {
  name: 'Villa Quinteros, Tucumán',
  center: { lat: -27.253671, lng: -65.552472 },
  zoom: 15,
  /** Área navegable: el borde del poblado más un margen. Limita las teselas que puede pedir cada visita. */
  bounds: { south: -27.266, west: -65.565, north: -27.240, east: -65.539 },
  source: { label: 'Gobiernos Locales · Villa Quinteros', url: 'https://unidades-territoriales.obraspublicas.gob.ar/Municipalities/Details/eff2e8b0-0fcc-43a7-8066-7541c1ca247c' },
} as const

export const isInsideTown = (lat: number, lng: number) =>
  lat >= TOWN.bounds.south && lat <= TOWN.bounds.north && lng >= TOWN.bounds.west && lng <= TOWN.bounds.east
