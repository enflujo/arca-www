import type { Feature, MultiPolygon, Point, Polygon } from 'geojson';

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

export type TiposCampos = 'singular' | 'lista' | 'parrafos' | 'gestos' | 'lugar';
export type LlavesRelaciones =
  | 'autores_id'
  | 'tecnicas_id'
  | 'objetos_id'
  | 'personajes_id'
  | 'simbolos_id'
  | 'escenarios_id'
  | 'descriptores_id'
  | 'caracteristicas_id';

export type LlavesCampos = 'separador' & NombresColecciones;
export interface CamposBasicosURL {
  nombre: string;
  slug: string;
}

export interface CamposCategoria extends CamposBasicosURL {
  ruta: string;
  campo: CamposCategorias;
}

export interface UbicacionProcesada {
  url: string;
  nombre: string;
}
export interface RegistroObra {
  registro: number;
  fecha_inicial: number;
  fecha_final: number;
  fecha?: string;
  sintesis: string;
  comentario_bibliografico: string;
  iconotexto: string;
  fuente: { descripcion: string };

  categoria1: CamposCategoria;
  categoria2: CamposCategoria;
  categoria3: CamposCategoria;
  categoria4: CamposCategoria;
  categoria5: CamposCategoria;
  categoria6: CamposCategoria;

  categorias?: CamposCategoria[];

  donante: CamposBasicosURL;
  relato_visual: CamposBasicosURL;
  fisiognomica: CamposBasicosURL;
  fisiognomica_imagen: CamposBasicosURL;
  cartela_filacteria: CamposBasicosURL;
  rostro: CamposBasicosURL;
  tipo_gestual: CamposBasicosURL;
  complejo_gestual: CamposBasicosURL;
  gesto1: CamposBasicosURL;
  gesto2: CamposBasicosURL;
  gesto3: CamposBasicosURL;

  ciudad_origen: { id: number; nombre: string; pais: CamposBasicosURL; procesado?: UbicacionProcesada[] } | null;

  ubicacion: {
    id: number;
    nombre: string;
    anotacion: string;
    geo: Point;
    ciudad: { id: number; nombre: string; pais: CamposBasicosURL };
    procesado?: UbicacionProcesada[];
  };

  autores: { autores_id: { id: number; nombre: string; apellido: string; nombreCompleto?: string } }[];
  tecnicas: { tecnicas_id: CamposBasicosURL };
  objetos: { objetos_id: CamposBasicosURL };
  personajes: { personajes_id: { slug: string; nombre: string; muerte: number } };
  simbolos: { simbolos_id: CamposBasicosURL };
  escenarios: { escenarios_id: CamposBasicosURL };
  descriptores: { descriptores_id: CamposBasicosURL };
  caracteristicas: { caracteristicas_id: CamposBasicosURL };
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
  contenido?: string;
  descripcion?: string;
  banner?: Imagen;
  seciones?: string[];
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
  imagen: ImagenArca;
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
  coleccion: NombresColecciones;
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
  categorias1?: IndiceGeneral[];
  categorias2?: IndiceGeneral[];
  categorias3?: IndiceGeneral[];
  categorias4?: IndiceGeneral[];
  categorias5?: IndiceGeneral[];
  categorias6?: IndiceGeneral[];
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
export type NombresCategorias =
  | 'categorias1'
  | 'categorias2'
  | 'categorias3'
  | 'categorias4'
  | 'categorias5'
  | 'categorias6';

export type CamposCategorias = 'categoria1' | 'categoria2' | 'categoria3' | 'categoria4' | 'categoria5' | 'categoria6';

export type NombresColecciones =
  | 'autores'
  | 'personajes'
  | 'ubicaciones'
  | 'ciudades'
  | 'paises'
  | NombresCategorias
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
