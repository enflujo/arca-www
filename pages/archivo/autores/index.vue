<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const autores = ref([]);
const cerebroArchivo = usarArchivo();

cerebroArchivo.paginaActual = 'Autores';

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

const { data, error, pending } = obtenerDatosAsinc('autores', Autores);

watch(data, ({ autores: datosAutores }) => {
  autores.value = datosAutores;
});

watch(error, (errores) => {
  console.error(errores);
});

definePageMeta({ layout: 'con-buscador' });
</script>

<template>
  <h1>Autores</h1>
  <Cargador v-if="pending" />
  <ul v-else>
    <li v-for="autor in autores" :key="`autor${autor.id}`">
      <NuxtLink :to="`/archivo/autores/${autor.id}`">
        {{ autor.apellido }}, {{ autor.nombre }} ({{ autor.obras_func.count }})
      </NuxtLink>
    </li>
  </ul>
</template>

<style lang="scss" scoped></style>
