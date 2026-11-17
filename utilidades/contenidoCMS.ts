// Lectura del HTML libre que viene del CMS (campo `contenido` de las páginas), para acomodarlo en las
// estructuras del rediseño sin perder lo que los editores escriben allí. Funciona igual en el servidor
// y en el navegador (no usa el DOM).

import { textoPlano } from '~/utilidades/seo';

export interface ImagenCMS {
  /** id del archivo en Directus */
  id: string;
  alt: string;
  /** Número de obra, si el texto alternativo empieza por él (p. ej. «12278 Charles Willson…»). */
  registro?: number;
}

/** Imagen principal de una página (la del CMS), lista para mostrar con su crédito. */
export interface ImagenPagina {
  src: string;
  alt: string;
  obra?: { registro: number; titulo: string; autor: string };
}

export interface SeccionCMS {
  titulo: string;
  /** HTML de cada párrafo (conserva enlaces y cursivas). */
  entradas: string[];
}

const RE_IMG = /<img\b[^>]*>/gi;
const RE_ID_ASSET = /\/assets\/([0-9a-f-]{36})/i;

export function imagenesCMS(html = ''): ImagenCMS[] {
  return (html.match(RE_IMG) ?? [])
    .map((etiqueta) => {
      const id = RE_ID_ASSET.exec(etiqueta)?.[1];
      if (!id) return null;
      const alt = textoPlano(/alt="([^"]*)"/i.exec(etiqueta)?.[1] ?? '');
      const registro = /^(\d{1,6})\b/.exec(alt)?.[1];
      return { id, alt, registro: registro ? Number(registro) : undefined };
    })
    .filter((i): i is ImagenCMS => !!i);
}

/** Párrafos del contenido con texto (sin imágenes), como HTML limpio de estilos de Word. */
export function parrafosCMS(html = ''): string[] {
  return (html.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) ?? [])
    .map((p) =>
      p
        .replace(/^<p\b[^>]*>|<\/p>$/gi, '')
        .replace(/<img\b[^>]*>/gi, '')
        .replace(/<(span|font)\b[^>]*>|<\/(span|font)>/gi, '')
        .replace(/\s(style|class|lang)="[^"]*"/gi, '')
        .replace(/<a\b(?![^>]*target=)/gi, '<a target="_blank" rel="noopener"')
        .trim()
    )
    .filter((p) => textoPlano(p).replace(/ /g, '').trim().length > 0);
}

/**
 * Divide el contenido en secciones según sus títulos (<h2>/<h3>). Lo que va antes del primer título
 * queda en una sección sin título.
 */
export function seccionesCMS(html = ''): SeccionCMS[] {
  const partes = html.split(/(<h[23]\b[^>]*>[\s\S]*?<\/h[23]>)/i);
  const secciones: SeccionCMS[] = [];
  let actual: SeccionCMS = { titulo: '', entradas: [] };

  partes.forEach((parte) => {
    if (/^<h[23]\b/i.test(parte)) {
      if (actual.titulo || actual.entradas.length) secciones.push(actual);
      actual = { titulo: textoPlano(parte), entradas: [] };
    } else {
      actual.entradas.push(...parrafosCMS(parte));
    }
  });

  if (actual.titulo || actual.entradas.length) secciones.push(actual);
  return secciones;
}

/** «BIBLIOGRAFIA GENERAL DE LAS FUENTES» → «Bibliografia general de las fuentes». */
export function tituloLegible(titulo: string): string {
  if (titulo !== titulo.toUpperCase()) return titulo;
  const minusculas = titulo.toLowerCase();
  return minusculas.charAt(0).toUpperCase() + minusculas.slice(1);
}
