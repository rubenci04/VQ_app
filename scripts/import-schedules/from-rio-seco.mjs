import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

// La fuente original divide el mismo recorrido en páginas con cabecera Río Seco.
// Solo se unen tramos cuando coinciden empresa, día, tipo y hora en Río Seco.
const sourcePath = fileURLToPath(new URL('../../../Rio Seco - app/src/data/json/schedules.json', import.meta.url))
const outputPath = fileURLToPath(new URL('../../src/data/json/schedules.json', import.meta.url))
const source = JSON.parse(readFileSync(sourcePath, 'utf8'))
const villaPages = source.pages.filter((page) => page.localityId === 'villa-quinteros')
const connector = (direction) => villaPages.find((page) => page.direction === direction)?.routes[0]
const southbound = connector('to-rio-seco') // Villa Quinteros → Río Seco
const northbound = connector('from-rio-seco') // Río Seco → Villa Quinteros
if (!southbound || !northbound) throw new Error('Faltan los tramos Villa Quinteros ↔ Río Seco')

const time = (value) => value?.replace(/^~/, '')
const pages = []
for (const page of source.pages) {
  const routes = []
  for (const route of page.routes) {
    const index = route.stops.findIndex((stop) => stop.city === 'Villa Quinteros')
    if (index >= 0) {
      const fromVilla = page.direction === 'from-rio-seco' && page.localityId !== 'villa-quinteros' || page.direction === 'to-rio-seco' && page.localityId === 'villa-quinteros'
      const start = fromVilla ? index : 0
      const end = fromVilla ? route.stops.length : index + 1
      if (end - start < 2) continue
      const trips = route.trips.flatMap((trip) => {
        const times = trip.times.slice(start, end)
        return times[0] && times.at(-1) ? [{ ...trip, times }] : []
      })
      if (trips.length) routes.push({ ...route, stops: route.stops.slice(start, end), trips })
      continue
    }

    const fromVilla = page.direction === 'from-rio-seco'
    const bridge = fromVilla ? southbound : northbound
    if (route.companyId !== bridge.companyId) continue
    if (fromVilla ? route.stops[0]?.city !== 'Río Seco' : route.stops.at(-1)?.city !== 'Río Seco') continue
    const trips = route.trips.flatMap((trip) => {
      const match = bridge.trips.find((part) =>
        part.dayType === trip.dayType && part.serviceType === trip.serviceType &&
        time(fromVilla ? part.times.at(-1) : part.times[0]) === time(fromVilla ? trip.times[0] : trip.times.at(-1)))
      if (!match || !trip.times[0] || !trip.times.at(-1)) return []
      return [{ ...trip, times: fromVilla
        ? [...match.times, ...trip.times.slice(1)]
        : [...trip.times, ...match.times.slice(1)] }]
    })
    if (trips.length) routes.push({ ...route, name: `${route.name} · vía Río Seco`, stops: fromVilla
      ? [...bridge.stops, ...route.stops.slice(1)]
      : [...route.stops, ...bridge.stops.slice(1)], trips })
  }
  const isVillaPage = page.localityId === 'villa-quinteros'
  const fromVilla = isVillaPage ? page.direction === 'to-rio-seco' : page.direction === 'from-rio-seco'
  pages.push({
    ...page,
    localityId: isVillaPage ? 'rio-seco' : page.localityId,
    localityName: isVillaPage ? 'Río Seco' : page.localityName,
    direction: fromVilla ? 'from-rio-seco' : 'to-rio-seco',
    routes,
    declared: { weekday: null, saturday: null, sunday: null },
    faqUniqueTimes: { weekday: 0, saturday: 0, sunday: 0 },
  })
}
const output = {
  source: source.source,
  fetchedAt: source.fetchedAt,
  notes: [
    'Horarios derivados de la fuente importada: tramos directos que incluyen Villa Quinteros y tramos unidos en Río Seco solo cuando coinciden empresa, día, tipo de servicio y hora.',
    'La coincidencia de horarios no garantiza que sea el mismo vehículo. Confirmá con la empresa si debés combinar y verificá cada horario antes de viajar.',
    'Se muestran todas las localidades del catálogo original. Cuando la fuente no aporta un tramo compatible desde Villa Quinteros, la localidad queda visible sin horarios confirmables.',
    'Los horarios aproximados de la fuente conservan el prefijo ~.',
  ],
  companies: source.companies,
  pages,
}
writeFileSync(outputPath, JSON.stringify(output) + '\n')
console.log(`${pages.length} páginas, ${new Set(pages.map((page) => page.localityId)).size} localidades, ${pages.reduce((n, page) => n + page.routes.reduce((m, route) => m + route.trips.length, 0), 0)} viajes`)
