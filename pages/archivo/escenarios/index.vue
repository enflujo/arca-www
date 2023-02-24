<script setup>
import { gql } from '~~/utilidades/ayudas';

const escenarios = ref([]);

const ObrasPorEscenarios = gql`
  query {
    escenarios(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { data, pending } = obtenerDatosAsinc('obrasPorEscenarios', ObrasPorEscenarios);

watch(data, ({ escenarios: datosEscenarios }) => {
  escenarios.value = datosEscenarios;
});

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Escenarios</h1>
  <Cargador v-if="pending" />
  <GraficaColombinas v-else :datos="escenarios" coleccion="escenarios" />
</template>
