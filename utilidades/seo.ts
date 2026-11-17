import { urlBase } from '~/config/general';

/** Llaves de imagen de Directus que se pueden pedir a través de /imagenes (evita usar el sitio como proxy abierto). */
export const LLAVES_IMAGEN = ['obra', 'og-banner'] as const;
export type LlaveImagen = (typeof LLAVES_IMAGEN)[number];

/** Convierte un texto en un fragmento de URL legible: «Última cena» → «ultima-cena». */
export function aSlug(texto = '', largoMax = 80): string {
  const slug = texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, largoMax)
    .replace(/-+$/, '');
  return slug || 'imagen';
}

/**
 * URL de una imagen servida desde el dominio de ARCA (/imagenes/...), con nombre de archivo descriptivo.
 * Las imágenes del API (apiarca) no se pueden indexar porque su robots.txt bloquea todo; al servirlas
 * desde el sitio, Google las asocia con la ficha de la obra.
 */
export function urlImagenPublica(id: string | number, titulo: string, llave: LlaveImagen = 'obra', absoluta = false) {
  const ruta = `/imagenes/${llave}/${id}/${aSlug(titulo)}.webp`;
  return absoluta ? `${urlBase}${ruta}` : ruta;
}

const ENTIDADES: Record<string, string> = {
  nbsp: ' ',
  amp: '&',
  quot: '"',
  apos: "'",
  lt: '<',
  gt: '>',
  laquo: '«',
  raquo: '»',
  ldquo: '“',
  rdquo: '”',
  lsquo: '‘',
  rsquo: '’',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  iexcl: '¡',
  iquest: '¿',
  ordf: 'ª',
  ordm: 'º',
  deg: '°',
  ccedil: 'ç',
  Ccedil: 'Ç',
};

const DIACRITICOS: Record<string, string> = { acute: '́', grave: '̀', tilde: '̃', uml: '̈', circ: '̂' };

/** Convierte entidades HTML en caracteres («&iacute;» → «í», «&ntilde;» → «ñ»). */
export function decodificarEntidades(texto: string): string {
  return texto
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-zA-Z])(acute|grave|tilde|uml|circ);/g, (_, letra, marca) =>
      `${letra}${DIACRITICOS[marca]}`.normalize('NFC')
    )
    .replace(/&([a-zA-Z]+);/g, (entidad, nombre) => ENTIDADES[nombre] ?? entidad);
}

/** Quita etiquetas y entidades HTML y colapsa espacios. */
export function textoPlano(html?: string | null): string {
  if (!html) return '';
  return decodificarEntidades(html.replace(/<[^>]*>/g, ' '))
    .replace(/ /g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Recorta un texto a `largo` caracteres sin partir palabras. */
export function recortar(texto: string, largo = 160): string {
  if (texto.length <= largo) return texto;
  const corte = texto.slice(0, largo - 1);
  return `${corte.slice(0, corte.lastIndexOf(' ') > 40 ? corte.lastIndexOf(' ') : corte.length)}…`;
}

/** Escapa texto para XML. */
export function escaparXML(texto = ''): string {
  return texto
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
