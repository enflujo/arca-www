import { defineStore } from 'pinia';
import { gql } from '~~/utilidades/ayudas';

export const usarGeneral = defineStore('general', {
  state: () => ({
    datosCargados: false,
    paginas: [],
    paginasArchivo: [],
    filtro: '',
    titulo: '',
    banner: null,
    descripcion: '',
    guardaescobas: '',
    buscadorVisible: false,
    busquedaActual: '',
    relaciones: [],
  }),

  actions: {
    async cargarGeneral() {
      const General = gql`
        query {
          general {
            nombre
            descripcion
            banner {
              id
              title
            }
            texto_footer
          }

          paginas(filter: { estado: { _eq: "publicado" } }, sort: ["sort"]) {
            titulo
            slug
          }

          paginas_archivo(filter: { estado: { _eq: "publicado" } }, sort: ["sort"]) {
            titulo
            slug
            mostrar_en_menu
          }
        }
      `;
      const { general, paginas, paginas_archivo } = await obtenerDatos('general', General);

      this.paginas = paginas;
      this.paginasArchivo = paginas_archivo;
      this.titulo = general.nombre || 'Arca';
      this.banner = general.banner;
      this.descripcion = general.descripcion || '';
      this.guardaescobas = general.texto_footer || '';
      this.datosCargados = true;
    },

    async cargarRelaciones() {
      const Relaciones = gql`
        query {
          relations_in_collection(collection: "obras") {
            field
            related_collection
          }
        }
      `;

      const { relations_in_collection } = await obtenerDatos('relaciones', Relaciones, true);

      this.relaciones = relations_in_collection.map((relacion) => {
        return { coleccionRelacionada: relacion.related_collection, campo: relacion.field };
      });
    },
  },
});
