// Estructura de navegación del rediseño 2026: 5 entradas en el menú principal y, para las secciones
// con varias páginas, el menú lateral. Lo usan Encabezado.vue, Menu/Archivo.vue y la barra que se
// inserta en /visualizacion-y-analisis (server/routes/visualizacion-y-analisis.get.ts).

export type Seccion = 'inicio' | 'coleccion' | 'visualizacion' | 'recursos' | 'sobre';

export interface EntradaMenu {
  titulo: string;
  ruta: string;
  seccion: Seccion;
  /** Página servida fuera de Nuxt: el enlace debe recargar la página completa. */
  externo?: boolean;
}

export const MENU_PRINCIPAL: EntradaMenu[] = [
  { titulo: 'Home', ruta: '/', seccion: 'inicio' },
  { titulo: 'Colección de ARCA', ruta: '/categorias', seccion: 'coleccion' },
  { titulo: 'Visualización y análisis', ruta: '/visualizacion-y-analisis', seccion: 'visualizacion', externo: true },
  { titulo: 'Recursos', ruta: '/productos-relacionados', seccion: 'recursos' },
  { titulo: 'Sobre ARCA', ruta: '/sobre-arca', seccion: 'sobre' },
];

/** Subpáginas (páginas generales del CMS) de las secciones Recursos y Sobre ARCA. */
export const SUBPAGINAS: Record<'recursos' | 'sobre', { titulo: string; slug: string }[]> = {
  recursos: [
    { titulo: 'Productos relacionados', slug: 'productos-relacionados' },
    { titulo: 'Uso de imágenes y bibliografía', slug: 'bibliografia-y-referencias' },
    { titulo: 'Open Source', slug: 'open-source' },
  ],
  sobre: [
    { titulo: 'Sobre ARCA', slug: 'sobre-arca' },
    { titulo: 'ARCA 2016–2022', slug: 'arca-version-2016-2022' },
  ],
};

/** Nombre de la sección, tal como aparece sobre el título de cada página. */
export const NOMBRE_SECCION: Record<Seccion, string> = {
  inicio: 'Home',
  coleccion: 'Colección de ARCA',
  visualizacion: 'Visualización y análisis',
  recursos: 'Recursos',
  sobre: 'Sobre ARCA',
};

/** A qué sección pertenece una ruta. Todo lo que no es inicio, recursos, sobre o visualización es la Colección. */
export function seccionDeRuta(ruta: string): Seccion {
  const primerTramo = ruta.split('?')[0]?.split('/')[1] ?? '';

  if (!primerTramo) return 'inicio';
  if (primerTramo === 'visualizacion-y-analisis') return 'visualizacion';
  if (SUBPAGINAS.recursos.some((p) => p.slug === primerTramo)) return 'recursos';
  if (SUBPAGINAS.sobre.some((p) => p.slug === primerTramo)) return 'sobre';
  return 'coleccion';
}
