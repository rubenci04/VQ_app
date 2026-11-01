import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import sharp from 'sharp'

mkdirSync('public/brand', { recursive: true })
mkdirSync('public/icons', { recursive: true })

// Si se agrega un logo propio, colocarlo en src/logo-vq.png y regenerar los recursos.
const suppliedLogo = 'src/logo-vq.png'
const fallback = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
<rect width="512" height="512" rx="112" fill="#174c91"/>
<text x="256" y="293" text-anchor="middle" font-family="Arial,sans-serif" font-size="188" font-weight="800" fill="white">VQ</text>
<path d="M170 342h172" stroke="#e4edf8" stroke-width="14" stroke-linecap="round"/>
</svg>`)
const source = existsSync(suppliedLogo) ? suppliedLogo : fallback
const logo = await sharp(source).png().toBuffer()
writeFileSync('public/brand/logo-v2.png', logo)
writeFileSync('public/brand/logo-mark-v2.png', logo)
const icon = (size: number) => sharp(logo).resize(size, size).png().toBuffer()
for (const [path, size] of [
  ['public/icons/icon-192-v2.png', 192],
  ['public/icons/icon-512-v2.png', 512],
  ['public/icons/icon-maskable-512-v2.png', 512],
  ['public/icons/apple-touch-icon-v2.png', 180],
  ['public/favicon-32-v2.png', 32],
  ['public/favicon-48-v2.png', 48],
] as const) writeFileSync(path, await icon(size))
copyFileSync('fondo.jpeg', 'public/brand/fondo.jpeg')
await sharp('fondo.jpeg').resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 84 }).toFile('public/brand/entrada.webp')
