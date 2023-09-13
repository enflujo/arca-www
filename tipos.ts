export interface Punto {
  x: number;
  y: number;
}

export type Estados = 'publicado' | 'borrador' | 'archivado';

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
  banne: Imagen;
}
