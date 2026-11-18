import { usarGeneral } from '~/cerebros/general';
import { GRUPOS_COLECCION, PAGINAS_OCULTAS_MENU, SUBPAGINAS, TITULOS_MENU, type Seccion } from '~/utilidades/menu';

export interface OpcionMenu {
  titulo: string;
  slug: string;
}

export interface GrupoMenu {
  titulo?: string;
  opciones: OpcionMenu[];
}

/**
 * Páginas del menú de una sección, agrupadas.
 * - Recursos / Sobre ARCA: sus subpáginas, sin títulos de grupo.
 * - Colección: las páginas del CMS ordenadas en «Datos básicos», «Datos de análisis» y «Datos de gestos»,
 *   como el panel de filtros de la visualización. Las que no estén en ningún grupo van al final.
 * Lo usan el menú lateral (components/Menu/Archivo.vue) y el menú de celular (components/Encabezado.vue).
 */
export function gruposDeSeccion(seccion: Seccion): GrupoMenu[] {
  if (seccion === 'recursos' || seccion === 'sobre') return [{ opciones: SUBPAGINAS[seccion] }];
  if (seccion !== 'coleccion') return [];

  const general = usarGeneral();
  const disponibles = general.paginasArchivo.filter((p) => p.mostrar_en_menu && !PAGINAS_OCULTAS_MENU.includes(p.slug));
  const porSlug = new Map(disponibles.map((p) => [p.slug, p]));
  const usados = new Set<string>();

  const grupos: GrupoMenu[] = GRUPOS_COLECCION.map((grupo) => ({
    titulo: grupo.titulo,
    opciones: grupo.paginas.flatMap((slug) => {
      const pagina = porSlug.get(slug);
      if (!pagina) return [];
      usados.add(slug);
      return [{ slug, titulo: TITULOS_MENU[slug] ?? pagina.titulo }];
    }),
  })).filter((g) => g.opciones.length);

  const resto = disponibles.filter((p) => !usados.has(p.slug)).map((p) => ({ slug: p.slug, titulo: p.titulo }));
  if (resto.length) grupos.push({ titulo: 'Otros', opciones: resto });
  return grupos;
}

/** ¿La ruta actual corresponde a esta página del menú? (las rutas /categoriasN/… cuentan como «categorias»). */
export function esPaginaActual(rutaActual: string, slug: string): boolean {
  const primerTramo = rutaActual.split('/')[1] ?? '';
  if (!primerTramo) return false;
  if (primerTramo.includes('categorias')) return slug === 'categorias';
  return primerTramo === slug;
}
