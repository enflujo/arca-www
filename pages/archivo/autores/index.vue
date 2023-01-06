<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const autores = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'autores';

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

  const { autores: datosAutores } = await obtenerDatos(Autores);
  autores.value = datosAutores;
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Autores</h1>
  <NuxtLink v-for="autor in autores" :key="`autor${autor.id}`" :to="`/archivo/autores/${autor.id}`">
    {{ autor.apellido }}, {{ autor.nombre }} ({{ autor.obras_func.count }})
  </NuxtLink>
</template>

<style lang="scss" scoped></style>
