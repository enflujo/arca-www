<script setup>
const ruta = useRoute();
const nombreColeccion = `categorias${ruta.params.numero}`;
definePageMeta({ layout: 'archivo', keepalive: true });
</script>

<template>
  <Galeria :coleccion="nombreColeccion" singular="Categoría" />
</template>
