import InstantSearch from 'vue-instantsearch/vue3/es';

export default defineNuxtPlugin((aplicacion) => {
  aplicacion.vueApp.use(InstantSearch);
});
