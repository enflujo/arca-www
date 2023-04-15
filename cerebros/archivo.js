import { defineStore } from 'pinia';
import { gql } from '~/utilidades/ayudas';

export const usarArchivo = defineStore('archivo', {
  state: () => ({
    obrasPorPagina: 25,
    vistaActual: '',
    datosCategorias: null,
  }),

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
      this.datosCategorias = categorias1;
    },
  },
});
