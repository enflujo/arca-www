import { defineStore } from 'pinia';
import type { Categoria, Vistas } from '~/tipos';
import obtenerDatos from '~/composables/obtenerDatos';
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
      const { categorias1 } = await obtenerDatos<{ categorias1: Categoria[] }>('datosCategorias1', Categorias1);

      this.datosCategorias = (categorias1 || []).map((categoria) => {
        if (categoria.imagen) {
          return {
            ...categoria,
            imagen: { ...categoria.imagen, ancho: 300, alto: 300 },
          };
        }

        return categoria;
      });
    },
  },
});
