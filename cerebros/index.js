export const state = () => ({});

export const actions = {
  /**
   * nuxtServerInit corre sólo 1 vez al cargar la página, sirve para cargar datos globales.
   */
  async nuxtServerInit({ dispatch }) {
    await dispatch('general/cargarGeneral');
  },
};
