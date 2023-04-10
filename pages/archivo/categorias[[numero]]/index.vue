<script setup>
import { aplanarCategorias } from '~~/utilidades/ayudas';

const categorias = ref([]);

const camposCategoria = (nivel = 1, respuesta) => {
  if (nivel === 1) {
    const agregado = `query {
        categorias${nivel}(limit: -1) {
          id
          nombre
          slug
          obras_func { count }
          `;
    return camposCategoria(nivel + 1, agregado);
  }

  if (nivel !== 1 && nivel <= 6) {
    const agregado =
      respuesta +
      `
        categorias${nivel}(limit: -1) {
          id
          nombre
          slug
          ancestro {
            id
          }
          obras_func { count }
          `;
    return camposCategoria(nivel + 1, agregado);
  } else {
    return respuesta + '}}}}}}}';
  }
};

const { data, pending } = obtenerDatosAsinc('categorias', camposCategoria());

watch(data, ({ categorias1 }) => {
  categorias.value = categorias1.map((categoria1) => {
    return aplanarCategorias(categoria1, 2);
  });
});

definePageMeta({ layout: 'archivo' });
</script>

<template>
  <h1>Categorías</h1>
  <Cargador v-if="pending" />

  <GraficaArbol v-else :datos="categorias" />
</template>

<style lang="scss" scoped>
ul {
  padding-left: 1em;
}
</style>
