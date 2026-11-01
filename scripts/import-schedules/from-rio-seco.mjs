import { readFileSync, writeFileSync } from 'node:fs'

// Reutiliza únicamente los horarios de la fuente original que incluyen una hora explícita
// en Villa Quinteros. No interpola paradas ni inventa recorridos.
const source = JSON.parse(readFileSync('../Rio Seco - app/src/data/json/schedules.json', 'utf8'))
const pages = []
for (const page of source.pages) {
  const routes = []
  for (const route of page.routes) {
    const index = route.stops.findIndex((stop) => stop.city === 'Villa Quinteros')
    if (index < 0) continue
    const fromVilla = page.direction === 'from-rio-seco' && page.localityId !== 'villa-quinteros' || page.direction === 'to-rio-seco' && page.localityId === 'villa-quinteros'
    const start = fromVilla ? index : 0
    const end = fromVilla ? route.stops.length : index + 1
    if (end - start < 2) continue
    const trips = route.trips.flatMap((trip) => {
      const times = trip.times.slice(start, end)
      return times[0] && times.at(-1) ? [{ ...trip, times }] : []
    })
    if (trips.length) routes.push({ ...route, stops: route.stops.slice(start, end), trips })
  }
  if (!routes.length) continue
  pages.push({ ...page, localityId: page.localityId === 'villa-quinteros' ? 'rio-seco' : page.localityId, localityName: page.localityId === 'villa-quinteros' ? 'Río Seco' : page.localityName, direction: page.direction === 'from-rio-seco' && page.localityId !== 'villa-quinteros' || page.direction === 'to-rio-seco' && page.localityId === 'villa-quinteros' ? 'from-rio-seco' : 'to-rio-seco', routes, declared: { weekday: null, saturday: null, sunday: null }, faqUniqueTimes: { weekday: 0, saturday: 0, sunday: 0 } })
}
const output = { source: source.source, fetchedAt: source.fetchedAt, notes: [
  'Se usan únicamente recorridos de la fuente importada para Río Seco que incluyen una parada y hora explícitas en Villa Quinteros.',
  'Los horarios aproximados de la fuente conservan el prefijo ~. Confirmá siempre con la empresa antes de viajar.',
], companies: source.companies, pages }
writeFileSync('src/data/json/schedules.json', JSON.stringify(output) + '\n')
console.log(`${pages.length} páginas, ${pages.reduce((n, p) => n + p.routes.reduce((m, r) => m + r.trips.length, 0), 0)} viajes con horario de Villa Quinteros`)
