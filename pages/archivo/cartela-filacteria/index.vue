<script setup>
import { gql } from '~~/utilidades/ayudas';

const cartelaFilacteria = ref([]);
const ObrasPorCartela = gql`
  query {
    cartelas_filacterias(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { data, pending } = obtenerDatosAsinc('obrasPorCartela', ObrasPorCartela);

watch(data, ({ cartelas_filacterias: datosCartelaFilacteria }) => {
  cartelaFilacteria.value = datosCartelaFilacteria;
});

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Cartela - Filacteria</h1>
  <Cargador v-if="pending" />
  <GraficaColombinas v-else :datos="cartelaFilacteria" coleccion="cartela-filacteria" />
</template>
