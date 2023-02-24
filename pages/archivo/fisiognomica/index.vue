<script setup>
import { gql } from '~~/utilidades/ayudas';

const fisiognomica = ref([]);
const ruta = useRoute();
const titulo = 'Fisiognómica';

const ObrasPorFisiognomica = gql`
  query {
    fisiognomicas(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { fisiognomicas: datosFisiognomica } = await obtenerDatos('obrasPorFisiognomica', ObrasPorFisiognomica);
fisiognomica.value = datosFisiognomica;

useHead(elementosCabeza({ titulo }, ruta.path));

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>{{ titulo }}</h1>
  <GraficaColombinas :datos="fisiognomica" coleccion="fisiognomica" />
</template>
