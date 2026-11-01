import { describe, expect, it } from 'vitest'
import { LocalJsonRepository } from '@/data/repository/localJsonRepository'
import { HUB_ID } from '@/features/transport/slug'
import { DEFAULT_QUERY } from '@/features/transport/query'

const repository = new LocalJsonRepository()

describe('contenido de Villa Quinteros', () => {
  it('publica la radio local y los lugares ubicados en el pueblo', async () => {
    const [radios, places, heritage] = await Promise.all([
      repository.getRadios(), repository.getPlaces(), repository.getHeritage(),
    ])
    expect(radios.find((radio) => radio.id === 'frecuencia-ies-977')).toMatchObject({
      frequency: '97.7 FM', siteUrl: 'https://www.facebook.com/FrecuenciaIES',
    })
    expect(places.filter((place) => place.location)).toHaveLength(5)
    expect(places.find((place) => place.id === 'comuna-villa-quinteros')?.pending).toContain('location')
    expect(heritage.map((section) => section.id)).toEqual(expect.arrayContaining([
      'pueblada-1969', 'festividad-san-ramon', 'desfile-dia-bandera', 'aniversario-villa-quinteros',
    ]))
  })

  it('ofrece horarios en ambos sentidos con Villa Quinteros como cabecera', async () => {
    const transport = await repository.getTransport()
    expect(HUB_ID).toBe('villa-quinteros')
    expect(transport.services.some((service) => service.originStopId === HUB_ID)).toBe(true)
    expect(transport.services.some((service) => service.destinationStopId === HUB_ID)).toBe(true)
    expect(transport.localities.some((locality) => locality.id === 'monteros')).toBe(true)
    expect(transport.localities).toHaveLength(20)
    expect(DEFAULT_QUERY.direction).toBe('from-rio-seco')
    expect(DEFAULT_QUERY.mode).toBe('all')
    expect(transport.services.some((service) => service.localityId === 'concepcion' && service.direction === 'from-rio-seco' && service.routeName?.includes('vía Río Seco'))).toBe(true)
    expect(transport.services.some((service) => service.localityId === 'aguilares' && service.direction === 'to-rio-seco' && service.routeName?.includes('vía Río Seco'))).toBe(true)
    expect(transport.localities.find((locality) => locality.id === 'lules')?.status).toBe('sin-datos')
  })
})
