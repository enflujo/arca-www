<script setup>
import { gql } from '~~/utilidades/ayudas';

const ruta = useRoute();

const { paginas } = await obtenerDatos(
  'indiceArchivo',
  gql`
    query {
      paginas(filter: { slug: { _eq: "archivo" } }, limit: 1) {
        titulo
        slug
        descripcion
        contenido
        banner {
          id
          title
        }
      }
    }
  `
);

useHead(elementosCabeza(paginas[0] ? paginas[0] : {}, ruta.path));

const pagina = ref(null);
pagina.value = paginas[0];

// Nuxt normaliza los nombres de "layouts" a kebab-case.
definePageMeta({ layout: 'archivo', keepalive: true });
</script>

<template>
  <h1>{{ pagina.titulo }}</h1>
</template>

<style lang="scss" scoped></style>
