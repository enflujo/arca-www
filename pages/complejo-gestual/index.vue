<script setup>
definePageMeta({ layout: 'archivo' });
const ruta = useRoute();
const titulo = 'Complejo Gestual';
useHead(elementosCabeza({ titulo }, ruta.path));
</script>

<template>
  <h1>{{ titulo }}</h1>
  <Vista coleccion="complejos_gestuales" ruta="complejo-gestual" />
</template>
