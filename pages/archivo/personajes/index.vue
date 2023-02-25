<script setup>
definePageMeta({ layout: 'con-buscador', keepalive: true });
const ruta = useRoute();
const titulo = 'Personajes';
useHead(elementosCabeza({ titulo }, ruta.path));
</script>

<template>
  <h1>{{ titulo }}</h1>
  <VistasGenerales coleccion="personajes" />
</template>
