<script setup>
import { gql } from '~~/utilidades/ayudas';

const relatos = ref([]);
const ObrasPorRelatos = gql`
  query {
    relatos_visuales(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { relatos_visuales: datosRelatos } = await obtenerDatos('obrasPorRelatos', ObrasPorRelatos);
relatos.value = datosRelatos;

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Relatos Visuales</h1>
  <GraficaColombinas :datos="relatos" coleccion="relatos-visuales" />
</template>
