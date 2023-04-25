<script setup>
const ruta = useRoute();
const nombreColeccion = `categorias${ruta.params.numero}`;
const nombreCampo = `categoria${ruta.params.numero}`;
definePageMeta({ layout: 'archivo', keepalive: true });
</script>

<template>
  <Galeria :coleccion="nombreColeccion" :nombreCampo="nombreCampo" singular="Categoría" />
</template>
