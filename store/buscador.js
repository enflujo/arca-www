import { gql } from 'nuxt-graphql-request';
// simil a data
export const state = () => ({
  seleccionados: [],
});

export const actions = {
  //
  async buscar({ commit }, filtro) {
    const query = gql`
      query {
        artworks(filter: { ${filtro.campo}: { id: { _eq: ${filtro.comparacion} } } }) {
          id
          title
          annotation_date
          latitude_current
          longitude_current
        }
      }
    `;

    const { artworks } = await this.$graphql.principal.request(query);

    commit('guardarSeleccionados', artworks);
  },
};

export const mutations = {
  guardarSeleccionados(state, seleccionados) {
    state.seleccionados = seleccionados;
  },
};
