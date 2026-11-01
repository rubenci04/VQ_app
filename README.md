# VQ App

Aplicación comunitaria independiente para Villa Quinteros, Tucumán. Basada en la app de Río Seco, con identidad, portada y enlace de Facebook adaptados.

## Estado del contenido

- La portada usa `fondo.jpeg`, aportada para Villa Quinteros.
- El logo definitivo aún no está en la carpeta. Se usa una marca temporal «VQ». Cuando llegue, guardarlo como `src/logo-vq.png` y ejecutar `npm run brand:build`.
- Las noticias de la Comuna se muestran desde [su Facebook](https://www.facebook.com/comunavillaquinteros/) mediante el visor oficial y un enlace directo. Facebook puede bloquear el visor según el navegador o sus ajustes.
- La carga automática de publicaciones en la base de datos requiere acceso a Meta Graph API y permisos de la página. No está activada.
- Los horarios, lugares, reseñas y fotografías específicos de Río Seco se retiraron. Las secciones siguen disponibles con estados vacíos hasta verificar datos de Villa Quinteros.

## Desarrollo y vista previa

```bash
npm ci
npm run brand:build
npm run dev
npm run build
```

La compilación usa datos locales por defecto. Para el despliegue conectado a GitHub en Cloudflare Workers, usar el comando de compilación `npm run build` y el de despliegue `npx wrangler deploy`. `wrangler.jsonc` publica los archivos de `dist` sin exigir D1. Requiere Node 22 o superior. El visor de Facebook no necesita credenciales.

`npm run lint` y `npm run build` pasan. La suite original de Río Seco conserva pruebas de sus horarios, lugares, fotos y textos; esas pruebas deben adaptarse al nuevo catálogo antes de usarse como control de contenido de Villa Quinteros.

## API, panel y Cloudflare Workers

El código original de Worker, D1, panel de administración y notificaciones se conserva para una etapa posterior. Para activarlo:

1. Crear una base D1 nueva llamada `vq-app` y reemplazar `REEMPLAZAR_CON_ID_D1_DE_VQ_APP` en `wrangler.api.jsonc` por su ID real. Nunca reutilizar la base de Río Seco.
2. Configurar un `VAPID_SUBJECT` propio y las credenciales necesarias según el módulo que se vaya a usar.
3. Aplicar migraciones con `npm run db:migrate:remote`.
4. Compilar con `VITE_DATA_MODE=hybrid` y ejecutar `npm run deploy:api`, o configurar `npx wrangler deploy --config wrangler.api.jsonc` como comando de despliegue en Cloudflare.
5. Para sincronización automática de Facebook, configurar el identificador de la página, un token autorizado y habilitar la fuente en el panel.

En modo estático, el panel y las notificaciones que requieren API no tienen un servidor conectado.
