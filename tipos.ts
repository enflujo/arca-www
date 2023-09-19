import type { Feature, MultiPolygon, Point, Polygon } from 'geojson';

export interface Punto {
  x: number;
  y: number;
}

export type Estados = 'publicado' | 'borrador' | 'archivado';
export type Vistas = 'abc' | 'colombinas' | 'mapa';

export interface Obra {
  id: number;
  estado: Estados;
  registro: number;
  titulo: string;
  autores: { autores_id: Autor }[];
  imagen?: Imagen;
}

export interface ObraEnRelacional {
  obras_id: ObraGaleria;
}

export interface ObraGaleria extends Obra {
  imagen?: ImagenArca;
}

export interface ObraInformacionBasica {
  id: string;
  nombre?: string;
  slug?: string;
  obras: number;
}

export interface ConteoObras {
  obras_func: { count: number };
}

export interface Pagina {
  titulo: string;
  slug: string;
  contenido: string;
  descripcion?: string;
  banner?: Imagen;
}

export type Imagen = {
  id: number;
  title: string;
  filename_download?: string;
  width: number;
  height: number;
};

export interface ImagenArca extends Imagen {
  ancho: number;
  alto: number;
}

export interface ColeccionGeneral extends ConteoObras {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string;
}
export interface Categoria extends ConteoObras {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string;
  imagen: Imagen;
  mostrarSubCategoria: boolean;
  [subnivel: string]: any;
}

export interface Autor extends ConteoObras {
  id: number;
  nombre: string;
  apellido?: string;
  desde?: number;
  desde_anotacion?: string;
  hasta?: number;
  hasta_anotacion?: string;
  biografia?: string;
  referencia: string;
  url?: string;
  texto?: string;
  nombreCompleto?: string;
}

export interface AutorProcesado extends Autor {
  fechas: FechasLista;
}

export interface Personaje extends ConteoObras {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string;
  fuente: string;
  muerte: number;
  muerte_anotacion: string;
  beatificacion_canonizacion_desde?: number;
  beatificacion_canonizacion_desde_anotacion?: string;
  beatificacion_canonizacion_hasta?: number;
  beatificacion_canonizacion_hasta_anotacion?: string;
  fechas?: FechasLista;
}

export interface PersonajeProcesado extends Personaje {
  fechas: FechasLista;
}

export type FechasLista = [desde?: string, hasta?: string];

export interface EntradaColeccion extends ConteoObras {
  banner: Imagen;
  descripcion: string;
  id: number;
  nombre: string;
  // contenido?: string;
}

export interface PaginaArchivo extends ConteoObras, CamposSEO {
  id: number;
  estado: Estados;
  mostrar_en_menu: boolean;
  titulo: string;
  slug: string;
  titulo_singular: string;
  coleccion: string;
  contenido: string;
}

export interface CamposSEO {
  descripcion: string;
  banner: Imagen;
}

export interface DatosVistas extends ConteoObras {
  id?: number;
  nombre: string;
  slug: string;
  texto: string;
  url: string;
  apellido?: string;
  nombreCompleto?: string;
}

export interface DatosVistaGestos extends DatosVistas {
  obras_gesto_1_func: { count: number };
  obras_gesto_2_func: { count: number };
  obras_gesto_3_func: { count: number };
}

export type Abecedario = {
  letra: string;
  elementos: { url: string; texto: string }[];
}[];

export type TiposLugares = 'paises' | 'ciudades' | 'ubicaciones';

export interface Pais extends ConteoObras {
  id: number;
  nombre: string;
  slug?: string;
  geo: Polygon | MultiPolygon;
  url?: string;
  texto?: string;
}

export interface Ubicacion extends ConteoObras {
  id: number;
  nombre: string;
  geo: Point;
  anotacion?: string;
  url?: string;
  texto?: string;
}

export interface Ciudad extends ConteoObras {
  id: number;
  nombre: string;
  url?: string;
  texto?: string;
}

export interface Gesto {
  id: number;
  codigo?: string;
  nombre: string;
  slug: string;
  descripcion: string;
  obras_gesto_1_func: { count: number };
  obras_gesto_2_func: { count: number };
  obras_gesto_3_func: { count: number };
  url?: string;
  texto?: string;
  banner: Imagen;
}

export interface IndiceGeneral extends ConteoObras {
  nombre: string;
  slug: string;
  url?: string;
  texto?: string;
}

export interface DatosUbicaciones extends Feature {
  properties: { id: number; nombre: string; obras: number };
}

export interface DatosCiudades extends Feature {
  properties: { id: number; nombre: string; obras: number };
}

export interface DatosPaises extends Feature {
  properties: { id: number; nombre: string; slug: string; obras: number };
}
export interface DatosLugares {
  ubicaciones: DatosUbicaciones[];
  ciudades: DatosCiudades[];
  paises: DatosPaises[];
}

export type DatosIndices = {
  paises?: Pais[];
  ubicaciones?: Ubicacion[];
  autores?: Autor[];
  ciudades?: Ciudad[];
  gestos?: Gesto[];
  personajes?: IndiceGeneral[];
  objetos?: IndiceGeneral[];
  escenarios?: IndiceGeneral[];
  tecnicas?: IndiceGeneral[];
  donantes?: IndiceGeneral[];
  relatos_visuales?: IndiceGeneral[];
  complejos_gestuales?: IndiceGeneral[];
  tipos_gestuales?: IndiceGeneral[];
  fisiognomicas?: IndiceGeneral[];
  fisiognomicas_imagen?: IndiceGeneral[];
  cartelas_filacterias?: IndiceGeneral[];
  rostros?: IndiceGeneral[];
  simbolos?: IndiceGeneral[];
  descriptores?: IndiceGeneral[];
  caracteristicas?: IndiceGeneral[];
};

export type Colecciones = {
  paises?: Pais[];
  ubicaciones?: Ubicacion[];
  autores?: Autor[];
  ciudades?: Ciudad[];
  gestos?: Gesto[];
  personajes?: ColeccionGeneral[];
  objetos?: ColeccionGeneral[];
  escenarios?: ColeccionGeneral[];
  tecnicas?: ColeccionGeneral[];
  donantes?: ColeccionGeneral[];
  relatos_visuales?: ColeccionGeneral[];
  complejos_gestuales?: ColeccionGeneral[];
  tipos_gestuales?: ColeccionGeneral[];
  fisiognomicas?: ColeccionGeneral[];
  fisiognomicas_imagen?: ColeccionGeneral[];
  cartelas_filacterias?: ColeccionGeneral[];
  rostros?: ColeccionGeneral[];
  simbolos?: ColeccionGeneral[];
  descriptores?: ColeccionGeneral[];
  caracteristicas?: ColeccionGeneral[];
};

export type Indices = (Pais | Ubicacion | Autor | Ciudad | Gesto | IndiceGeneral)[];

export type NombresColecciones =
  | 'autores'
  | 'personajes'
  | 'ubicaciones'
  | 'ciudades'
  | 'paises'
  | 'objetos'
  | 'escenarios'
  | 'tecnicas'
  | 'donantes'
  | 'relatos_visuales'
  | 'complejos_gestuales'
  | 'tipos_gestuales'
  | 'gestos'
  | 'fisiognomicas'
  | 'fisiognomicas_imagen'
  | 'cartelas_filacterias'
  | 'rostros'
  | 'simbolos'
  | 'descriptores'
  | 'caracteristicas';
