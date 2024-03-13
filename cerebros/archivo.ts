import { defineStore } from 'pinia';
import type { ImagenArca, Vistas } from '~/tipos';
import { gql } from '~/utilidades/ayudas';

interface DatosCategoria1 {
  categorias1: {
    id: number;
    slug: string;
    nombre: string;
    descripcion: string;
    imagen: ImagenArca;
    mostrarSubCategoria: boolean;
    [subnivel: string]: any;
  };
}
export interface CerebroArchivo {
  obrasPorPagina: number;
  vistaActual: Vistas;
  datosCategorias?: {
    id: number;
    slug: string;
    nombre: string;
    descripcion: string;
    imagen: ImagenArca;
    mostrarSubCategoria: boolean;
    [subnivel: string]: any;
  };
}

export const usarArchivo = defineStore('archivo', {
  state: () =>
    ({
      obrasPorPagina: 25,
      vistaActual: 'abc',
    }) as CerebroArchivo,

  actions: {
    async cargarDatosCategorias() {
      const Categorias1 = gql`
        query {
          categorias1(sort: ["nombre"], limit: -1) {
            id
            slug
            nombre
            descripcion
            imagen {
              id
              title
            }
            obras_func {
              count
            }
          }
        }
      `;
      const { categorias1 } = await obtenerDatos<DatosCategoria1>('datosCategorias1', Categorias1);

      if (categorias1.imagen) {
        categorias1.imagen.ancho = 300;
        categorias1.imagen.alto = 300;
      }
      this.datosCategorias = categorias1;
    },
  },
});
