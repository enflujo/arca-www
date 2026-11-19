import { apiBase } from '~/config/general';
import { LLAVES_IMAGEN } from '~/utilidades/seo';

// Sirve las imágenes del API desde el dominio de ARCA: /imagenes/{llave}/{id}/{nombre-descriptivo}.webp
// El nombre del archivo es solo descriptivo (SEO); la imagen se identifica por su id.

const ID_VALIDO = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default defineEventHandler(async (event) => {
  const llave = getRouterParam(event, 'llave') ?? '';
  const id = getRouterParam(event, 'id') ?? '';

  if (!(LLAVES_IMAGEN as readonly string[]).includes(llave) || !ID_VALIDO.test(id)) {
    throw createError({ statusCode: 404, statusMessage: 'Imagen no encontrada' });
  }

  try {
    const respuesta = await $fetch.raw<ArrayBuffer>(`${apiBase}/assets/${id}?key=${llave}`, {
      responseType: 'arrayBuffer',
      timeout: 20000,
    });

    setHeader(event, 'Content-Type', respuesta.headers.get('content-type') ?? 'image/webp');
    setHeader(event, 'Cache-Control', 'public, max-age=2592000, immutable');
    return Buffer.from(respuesta._data as ArrayBuffer);
  } catch {
    throw createError({ statusCode: 404, statusMessage: 'Imagen no encontrada' });
  }
});
