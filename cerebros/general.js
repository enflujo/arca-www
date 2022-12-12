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
