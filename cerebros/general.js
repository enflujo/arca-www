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
  },
});
