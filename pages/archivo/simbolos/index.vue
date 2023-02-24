<script setup>
import { gql } from '~~/utilidades/ayudas';

const simbolos = ref([]);
const ObrasPorSimbolos = gql`
  query {
    simbolos(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { data, pending } = obtenerDatosAsinc('obrasPorSimbolos', ObrasPorSimbolos);

watch(data, ({ simbolos: datosSimbolos }) => {
  simbolos.value = datosSimbolos;
});

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Simbolos</h1>
  <Cargador v-if="pending" />
  <GraficaColombinas v-else :datos="simbolos" coleccion="simbolos" />
</template>
