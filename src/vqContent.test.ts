import { describe, expect, it } from 'vitest'
import { LocalJsonRepository } from '@/data/repository/localJsonRepository'
import { HUB_ID } from '@/features/transport/slug'

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
    expect(heritage.map((section) => section.id)).toContain('pueblada-1969')
  })

  it('ofrece horarios en ambos sentidos con Villa Quinteros como cabecera', async () => {
    const transport = await repository.getTransport()
    expect(HUB_ID).toBe('villa-quinteros')
    expect(transport.services.some((service) => service.originStopId === HUB_ID)).toBe(true)
    expect(transport.services.some((service) => service.destinationStopId === HUB_ID)).toBe(true)
    expect(transport.localities.some((locality) => locality.id === 'monteros')).toBe(true)
  })
})
