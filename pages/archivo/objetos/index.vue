<script setup>
definePageMeta({ layout: 'con-buscador' });
const ruta = useRoute();
const titulo = 'Objetos';
useHead(elementosCabeza({ titulo }, ruta.path));
</script>

<template>
  <h1>{{ titulo }}</h1>
  <VistasGenerales coleccion="objetos" />
</template>
