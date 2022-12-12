import { defineStore } from 'pinia';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

export const usarGeneral = defineStore('general', {
  state: () => ({
    datosCargados: false,
    datos: {},
    menus: {},
    filtro: '',
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
      const { general, menus } = await obtenerDatos(General);

      this.datos = general;

      menus.forEach((menu) => {
        this.menus[menu.nombre] = menu.paginas.map((pagina) => pagina.paginas_id);
      });

      this.datosCargados = true;
    },
  },
});
