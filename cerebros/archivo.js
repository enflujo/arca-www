import { defineStore } from 'pinia';

export const usarArchivo = defineStore('archivo', {
  state: () => ({
    obrasPorPagina: 25,
    vistaActual: '',
  }),
});
