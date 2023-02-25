<script setup>
definePageMeta({ layout: 'con-buscador', keepalive: true });
const ruta = useRoute();
const titulo = 'Relatos Visuales';
useHead(elementosCabeza({ titulo }, ruta.path));
</script>

<template>
  <h1>{{ titulo }}</h1>
  <VistasGenerales coleccion="relatos_visuales" ruta="relatos-visuales" />
</template>
