import { urlBase } from '~/config/general';

// Redirecciones permanentes (301) desde la versión anterior de ARCA (arcav1.uniandes.edu.co).
// Google todavía tiene indexadas sus páginas e imágenes y hoy responden con error. Si el dominio
// arcav1 se apunta a este servidor, cada URL vieja lleva a su equivalente nuevo.
// El número de obra de la versión anterior es el mismo `registro` de la actual.
//
//   /artworks/10742                                         → /obras/10742
//   /system/artworks/avatars/000/010/742/large/10742.jpg   → /obras/10742/imagen (y de ahí a la imagen)
//   /artworks?topic=6, /artworks, cualquier otra           → /
//
// La misma tabla está en docs/redirecciones-arcav1.md para configurarla en nginx/Apache si se prefiere.

const DOMINIOS_VIEJOS = ['arcav1.uniandes.edu.co'];

export function rutaNueva(ruta: string): string {
  const [camino] = ruta.split('?');

  const obra = /^\/artworks\/(\d+)\/?$/.exec(camino ?? '');
  if (obra) return `/obras/${obra[1]}`;

  const imagen = /^\/system\/artworks\/avatars\/.*\/(\d+)\.(jpe?g|png|gif|webp)$/i.exec(camino ?? '');
  if (imagen) return `/obras/${imagen[1]}/imagen`;

  return '/';
}

export default defineEventHandler((event) => {
  const host = (getRequestHost(event, { xForwardedHost: true }) || '').split(':')[0]?.toLowerCase() ?? '';
  if (!DOMINIOS_VIEJOS.includes(host)) return;

  return sendRedirect(event, `${urlBase}${rutaNueva(event.path)}`, 301);
});
