import { defineStore } from 'pinia';
import type { Categoria, Vistas } from '~/tipos';
import { gql } from '~/utilidades/ayudas';

export type CerebroArchivo = {
  obrasPorPagina: number;
  vistaActual: Vistas;
  datosCategorias?: Categoria[];
};

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

      const { categorias1 } = await obtenerDatos('datosCategorias1', Categorias1);
      if (categorias1.imagen) {
        categorias1.imagen.ancho = 300;
        categorias1.imagen.alto = 300;
      }
      this.datosCategorias = categorias1;
    },
  },
});
