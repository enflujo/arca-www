<script setup>
definePageMeta({ layout: 'archivo' });
const ruta = useRoute();
const titulo = 'Características Particulares';
useHead(elementosCabeza({ titulo }, ruta.path));
</script>

<template>
  <h1>{{ titulo }}</h1>
  <Vista coleccion="caracteristicas" ruta="caracteristicas-particulares" />
</template>
