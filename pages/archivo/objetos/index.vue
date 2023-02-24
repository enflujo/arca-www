<script setup>
import { gql } from '~~/utilidades/ayudas';

const objetos = ref([]);
const ObrasPorObjetos = gql`
  query {
    objetos(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { objetos: datosObjetos } = await obtenerDatos('obrasPorObjetos', ObrasPorObjetos);
objetos.value = datosObjetos;

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Objetos</h1>
  <GraficaColombinas :datos="objetos" coleccion="objetos" />
</template>
