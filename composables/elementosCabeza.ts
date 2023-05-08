import { usarGeneral } from '~~/cerebros/general';
import { urlBase } from '~~/config/general';
import { urlImagen } from '~~/utilidades/ayudas';

export type ImagenDirectus = {
  id?: number;
  title: string;
};

export type DatosPagina = {
  nombre?: string;
  titulo?: string;
  banner?: ImagenDirectus;
  descripcion?: string;
};

/**
 * Crea el objeto con todos los elementos necesarios para SEO de las páginas.
 * @example
 * ```js
 * // Dentro del script de la página:
 * head() {
 *   return elementosCabeza({nombre, descripcion, banner}, ruta.path);
 * }
 * ```
 * @param datosPagina Los datos para SEO.
 * @param datosPagina.nombre El título de la página actual.
 * @param datosPagina.descripcion La descripción corta de la página actual.
 * @param datosPagina.banner Objeto con `id` y `title` que describe la imagen en el API.
 * @param ruta Ruta de la página actual, se puede sacar con `ruta.path`.
 * @returns El objeto con todas las partes de meta tags.
 */

export default function (datosPagina: DatosPagina, ruta: string) {
  const cerebroGeneral = usarGeneral();

  const cabeza = `: ${cerebroGeneral.titulo} :`;
  const subtitulo = datosPagina.nombre || datosPagina.titulo;
  const title = subtitulo ? `${subtitulo} | ${cabeza}` : cabeza;
  const url = urlBase + ruta;
  let img;

  if (datosPagina.banner && datosPagina.banner.id) {
    img = urlImagen(datosPagina.banner.id, 'og-banner');
  } else {
    img = `${urlBase}/arca-of.webp`;
    datosPagina.banner = { title: cerebroGeneral.titulo };
  }

  const descripcion = datosPagina.descripcion ? datosPagina.descripcion : cerebroGeneral.descripcion;

  return {
    title,
    meta: [
      { name: 'description', content: descripcion },
      // Open Graph: Facebook
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:title', content: title },
      { property: 'og:description', content: descripcion },
      { property: 'og:image', content: img },
      // Twitter
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:url', content: url },
      { property: 'twitter:title', content: title },
      { property: 'twitter:description', content: descripcion },
      { property: 'twitter:image', content: img },
      { property: 'twitter:image:alt', content: datosPagina.banner.title },
    ],
    link: [{ rel: 'canonical', href: url }],
  };
}
