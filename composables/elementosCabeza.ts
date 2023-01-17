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

const cerebroGeneral = usarGeneral();

/**
 * Ayuda a crear el título con estilos propios.
 *
 * @param {string} subtitulo El nombre o título de la página actual, se puede dejar vacío para el Home.
 * @returns Título para el head con estilos personalizados.
 */
const crearTitulo = (subtitulo: string | undefined) => {
  const cabeza = `..:: ${cerebroGeneral.titulo} ::..`;
  return subtitulo ? `${cabeza} | ${subtitulo}` : cabeza;
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
 * @param {object} datosPagina Los datos para SEO.
 * @param {string} datosPagina.nombre El título de la página actual.
 * @param {string} datosPagina.descripcion La descripción corta de la página actual.
 * @param {object} datosPagina.banner Objeto con `id` y `title` que describe la imagen en el API.
 * @param {string} ruta Ruta de la página actual, se puede sacar con `ruta.path`.
 * @returns {object} El objeto con todas las partes de meta tags.
 */

export default function (datosPagina: DatosPagina, ruta: string) {
  const title = crearTitulo(datosPagina.nombre || datosPagina.titulo);
  const url = urlBase + ruta;
  let img;

  if (datosPagina.banner && datosPagina.banner.id) {
    img = urlImagen(datosPagina.banner.id, 'og-banner');
  } else {
    img = `${urlBase}/imgs/og-EnFlujo-predeterminado.jpg`;
    datosPagina.banner = { title: cerebroGeneral.titulo };
  }

  if (!datosPagina.descripcion) {
    datosPagina.descripcion = cerebroGeneral.descripcion;
  }

  return {
    title,
    meta: [
      { name: 'description', content: datosPagina.descripcion },
      // Open Graph: Facebook
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:title', content: title },
      { property: 'og:description', content: datosPagina.descripcion },
      { property: 'og:image', content: img },
      // Twitter
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:site', content: '@labenflujo' },
      { property: 'twitter:url', content: url },
      { property: 'twitter:title', content: title },
      { property: 'twitter:description', content: datosPagina.descripcion },
      { property: 'twitter:image', content: img },
      { property: 'twitter:image:alt', content: datosPagina.banner.title },
    ],
  };
}
