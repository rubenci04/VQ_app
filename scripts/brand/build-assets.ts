import { mkdirSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

mkdirSync('public/brand', { recursive: true })
mkdirSync('public/icons', { recursive: true })

// El JPG aportado tiene fondo blanco. El recorte conserva el sol y las alas azules.
const artwork = await sharp('logo _vq.jpg').trim({ background: '#ffffff', threshold: 20 }).png().toBuffer()
writeFileSync('public/brand/logo-v3.png', artwork)
writeFileSync('public/brand/logo-mark-v3.png', artwork)

for (const [path, size, pad] of [
  ['public/icons/icon-192-v3.png', 192, 20],
  ['public/icons/icon-512-v3.png', 512, 56],
  ['public/icons/icon-maskable-512-v3.png', 512, 110],
  ['public/icons/apple-touch-icon-v3.png', 180, 18],
  ['public/favicon-32-v3.png', 32, 1],
  ['public/favicon-48-v3.png', 48, 2],
] as const) {
  const art = await sharp(artwork).resize(size - pad * 2, size - pad * 2, { fit: 'contain', background: '#ffffff' }).png().toBuffer()
  writeFileSync(path, await sharp({ create: { width: size, height: size, channels: 4, background: '#ffffff' } }).composite([{ input: art, left: pad, top: pad }]).png().toBuffer())
}
