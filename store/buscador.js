import { gql } from 'nuxt-graphql-request';
// simil a data
export const state = () => ({
  busquedaActual: '',
  seleccionados: [],
  guardados: {},
});

export const actions = {
  async buscar({ commit, state }, filtro) {
    /**
     * si existe el campo en guardados && si existe lo que se esta buscando de ese campo,
     * usa los elementos guardados en `state.guardados`.
     * De lo contrario, hace la petición al servidor.
     */
    if (state.guardados[filtro.campo] && state.guardados[filtro.campo][filtro.comparacion]) {
      commit('usarGuardados', state.guardados[filtro.campo][filtro.comparacion]);
    } else {
      const campo2 = filtro.campo2 || 'id';
      const busqueda = campo2 === 'id' ? +filtro.comparacion : `"${filtro.comparacion}"`;

      const query = gql`
      query {
        artworks(filter: { ${filtro.campo}: { ${campo2}: { _eq: ${busqueda} } } }, limit: -1) {
          id
          title
          annotation_date
          synthesis
          latitude_current
          longitude_current
          image {
            id
            title
          }
          author_id {
            id
            name
            lastname
            biography
          }
          actual_country_id {
            id
            name_spanish
          }
        }
      }
    `;

      const { artworks } = await this.$graphql.principal.request(query);
      commit('guardarSeleccionados', {
        artworks,
        filtro,
      });
    }
  },
};

export const mutations = {
  guardarSeleccionados(state, datos) {
    const guardados = state.guardados;
    if (!guardados[datos.filtro.campo]) {
      guardados[datos.filtro.campo] = {};
    }

    guardados[datos.filtro.campo][datos.filtro.comparacion] = datos.artworks;

    state.guardados = guardados;
    state.seleccionados = datos.artworks;
    state.busquedaActual = datos.filtro.comparacion;
  },

  usarGuardados(state, artworks) {
    state.seleccionados = artworks;
  },
};
