<script setup>
import { gql } from '~~/utilidades/ayudas';

const tecnicas = ref([]);
const ObrasPorTecnicas = gql`
  query {
    tecnicas(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { tecnicas: datosTecnicas } = await obtenerDatos('obrasPorTecnicas', ObrasPorTecnicas);
tecnicas.value = datosTecnicas;

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Técnicas</h1>
  <GraficaColombinas :datos="tecnicas" coleccion="tecnicas" />
</template>
