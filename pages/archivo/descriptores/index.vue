<script setup>
definePageMeta({ layout: 'con-buscador' });
const ruta = useRoute();
const titulo = 'Descriptores';
useHead(elementosCabeza({ titulo }, ruta.path));
</script>

<template>
  <h1>{{ titulo }}</h1>
  <VistasGenerales coleccion="descriptores" />
</template>
