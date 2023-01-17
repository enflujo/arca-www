<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const cerebroArchivo = usarArchivo();
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
cerebroArchivo.paginaActual = '';

// Nuxt normaliza los nombres de "layouts" a kebab-case.
definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <MenuVistas />
  <h1>{{ pagina.titulo }}</h1>
</template>

<style lang="scss" scoped></style>
