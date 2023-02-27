<script setup>
import { gql } from '~~/utilidades/ayudas';

const caracteristicas = ref([]);

const ObrasPorCaracteristicas = gql`
  query {
    caracteristicas(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { data, pending } = obtenerDatosAsinc('obrasPorCaracteristicas', ObrasPorCaracteristicas);

watch(data, ({ caracteristicas: datosCaracteristicas }) => {
  caracteristicas.value = datosCaracteristicas;
});

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Características Particulares</h1>
  <Cargador v-if="pending" />
  <GraficaColombinas v-else :datos="caracteristicas" coleccion="caracteristicas-particulares" />
</template>
