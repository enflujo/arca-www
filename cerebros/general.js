import { defineStore } from 'pinia';
import { gql } from '~~/utilidades/ayudas';

export const usarGeneral = defineStore('general', {
  state: () => ({
    datosCargados: false,
    menus: {},
    filtro: '',
    titulo: '',
    banner: null,
    descripcion: '',
    guardaescobas: '',
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

          menus {
            nombre
            paginas {
              paginas_id {
                slug
                titulo
              }
            }
          }
        }
      `;
      const { general, menus } = await obtenerDatos('general', General);

      this.titulo = general.nombre || 'Arca';
      this.banner = general.banner;
      this.descripcion = general.descripcion || '';
      this.guardaescobas = general.texto_footer || '';

      menus.forEach((menu) => {
        this.menus[menu.nombre] = menu.paginas.map((pagina) => pagina.paginas_id);
      });

      this.datosCargados = true;
    },
  },
});
