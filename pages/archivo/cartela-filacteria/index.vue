<script setup>
definePageMeta({ layout: 'con-buscador' });
const ruta = useRoute();
const titulo = 'Cartela - Filacteria';
useHead(elementosCabeza({ titulo }, ruta.path));
</script>

<template>
  <h1>{{ titulo }}</h1>
  <VistasGenerales coleccion="cartelas_filacterias" ruta="cartela-filacteria" />
</template>
