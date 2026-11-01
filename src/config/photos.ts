/** Las fotografías locales se incorporan cuando se confirme su procedencia. */
export const PHOTO_SOURCE = { label: 'VQ App', url: 'https://www.facebook.com/comunavillaquinteros/' } as const

export interface Photo {
  id: string
  src: string
  width: number
  height: number
  alt: string
  kind?: 'foto' | 'ilustracion'
}

export const SECTION_PHOTOS: Record<string, string[]> = {}
export const PLACE_PHOTOS: Record<string, string[]> = {}
export const PHOTOS: Record<string, Photo> = {}
