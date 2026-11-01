import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { BusSearchForm } from '@/components/transport/BusSearchForm'
import { LocalJsonRepository } from '@/data/repository/localJsonRepository'
import { DEFAULT_QUERY, swapDirection } from '@/features/transport/query'

describe('selección de localidades', () => {
  it('ofrece el catálogo completo en ida y vuelta', async () => {
    const transport = await new LocalJsonRepository().getTransport()
    const onChange = vi.fn()
    const props = {
      localities: transport.localities,
      companies: transport.companies,
      serviceTypes: ['común', 'semirrápido'],
      isFavorite: false,
      onChange,
      onToggleFavorite: vi.fn(),
      onShare: vi.fn(),
    }
    const { rerender } = render(<BusSearchForm {...props} query={DEFAULT_QUERY} />)
    expect(screen.getByRole('combobox', { name: 'Destino' }).querySelectorAll('option')).toHaveLength(20)
    fireEvent.click(screen.getByRole('button', { name: 'Invertir origen y destino' }))
    expect(onChange).toHaveBeenCalledWith({ ...DEFAULT_QUERY, direction: 'to-rio-seco' })
    rerender(<BusSearchForm {...props} query={{ ...DEFAULT_QUERY, direction: swapDirection(DEFAULT_QUERY.direction) }} />)
    expect(screen.getByRole('combobox', { name: 'Origen' }).querySelectorAll('option')).toHaveLength(20)
    expect(screen.getByRole('option', { name: /Lules/ })).toBeInTheDocument()
  })
})
