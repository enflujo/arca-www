import { defineStore } from 'pinia';

export const usarArchivo = defineStore('archivo', {
  state: () => ({
    paginaActual: null,
  }),
});
