<script setup>
import { usarArchivo } from '~~/cerebros/archivo';

const autores = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador' });

const { data, error, pending } = await useAsyncGql('Autores', {});

watch(data, ({ autores: datosAutores }) => {
  console.log('hey');
  autores.value = datosAutores;
});

if (error.value) {
  console.error(error.value);
}

watch(error, (errores) => {
  console.error(errores);
});

onMounted(() => {
  cerebroArchivo.paginaActual = 'autores';
});
</script>

<template>
  <Cargador v-if="pending" />

  <h1>Index de Autores</h1>
  <p v-for="autor in autores" :key="`autor${autor.id}`">
    {{ autor.nombre }} {{ autor.apellido }} - {{ autor.obras_func.count }}
  </p>
</template>

<style lang="scss" scoped></style>
