import { defineStore } from 'pinia';

export const usarGeneral = defineStore('general', {
  state: () => ({
    datosCargados: false,
    datos: {},
    menus: {},
    filtro: '',
  }),

  actions: {
    async cargarGeneral() {
      const { data } = await useAsyncGql('General');
      this.datos = data.value.general;

      data.value.menus.forEach((menu) => {
        this.menus[menu.nombre] = menu.paginas.map((pagina) => pagina.paginas_id);
      });
      this.datosCargados = true;
    },
  },
});

export const actions = {
  async cargarGeneral({ commit }) {
    const queryGeneral = gql`
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
    const { general, menus } = await this.$graphql.principal.request(queryGeneral);

    commit('actualizarDatos', general);
    commit('actualizarMenus', menus);
  },
};

export const mutations = {
  actualizarDatos(state, datos) {
    state.datos = { ...state.datos, ...datos };
  },

  actualizarMenus(state, menus) {
    menus.forEach((menu) => {
      state.menus[menu.nombre] = menu.paginas.map((pagina) => pagina.paginas_id);
    });
  },

  actualizarFiltro(state, filtro) {
    state.filtro = filtro;
  },
};
