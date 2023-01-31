import { defineStore } from 'pinia';

export const usarArchivo = defineStore('archivo', {
  state: () => ({
    paginaActual: null,
    obrasPorPagina: 25,
  }),
});
