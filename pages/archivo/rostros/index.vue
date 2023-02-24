<script setup>
import { gql } from '~~/utilidades/ayudas';

const rostros = ref([]);
const ObrasPorRostros = gql`
  query {
    rostros(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { rostros: datosRostros } = await obtenerDatos('obrasPorRostros', ObrasPorRostros);
rostros.value = datosRostros;

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Rostros</h1>
  <GraficaColombinas :datos="rostros" coleccion="rostros" />
</template>
