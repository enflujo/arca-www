<script setup>
definePageMeta({ layout: 'archivo' });
const ruta = useRoute();
const titulo = 'Objetos';
useHead(elementosCabeza({ titulo }, ruta.path));
</script>

<template>
  <h1>{{ titulo }}</h1>
  <Vista coleccion="objetos" />
</template>
