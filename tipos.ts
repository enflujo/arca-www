export interface Pagina {
  titulo: string;
  slug: string;
  descripcion?: string;
  banner?: Imagen;
}

export type Imagen = {
  id: number;
  title: string;
};

export interface Categoria {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string;
  imagen: Imagen;
  obras_func: { count: number };
  mostrarSubCategoria: boolean;
  [subnivel: string]: any;
}
