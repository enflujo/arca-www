import { urlImagenPublica } from '~/utilidades/seo';

// /obras/{registro}/imagen → redirige a la imagen de esa obra (/imagenes/obra/{id}/{titulo}.webp).
// Sirve para las redirecciones desde las imágenes de la versión anterior (arcav1), que se identificaban por registro.
export default defineCachedEventHandler(
  async (event) => {
    const registro = getRouterParam(event, 'registro') ?? '';
    if (!/^\d+$/.test(registro)) throw createError({ statusCode: 404, statusMessage: 'Obra no encontrada' });

    const datos = await consultaAPI<{ obras: { titulo: string; imagen?: { id: string } | null }[] }>(
      `query { obras(filter: { registro: { _eq: ${registro} } }, limit: 1) { titulo imagen { id } } }`
    );
    const obra = datos.obras[0];
    if (!obra?.imagen?.id) throw createError({ statusCode: 404, statusMessage: 'Imagen no encontrada' });

    return sendRedirect(event, urlImagenPublica(obra.imagen.id, obra.titulo), 301);
  },
  { maxAge: 60 * 60 * 24, name: 'imagen-por-registro', getKey: (event) => getRouterParam(event, 'registro') ?? '' }
);
