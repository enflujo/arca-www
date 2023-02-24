<script setup>
import { gql } from '~~/utilidades/ayudas';

const autores = ref([]);

const Autores = gql`
  query {
    autores(limit: -1, sort: ["apellido"]) {
      id
      nombre
      apellido
      obras_func {
        count
      }
    }
  }
`;

const { data, pending } = obtenerDatosAsinc('autores', Autores);

watch(data, ({ autores: datosAutores }) => {
  autores.value = datosAutores;
});

definePageMeta({ layout: 'con-buscador' });
</script>

<template>
  <h1>Autores</h1>
  <Cargador v-if="pending" />
  <VistaAbecedario v-else coleccion="autores" :datos="autores" />
</template>

<style lang="scss" scoped></style>
