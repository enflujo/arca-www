<script setup>
definePageMeta({ layout: 'archivo', keepalive: true });
</script>

<template>
  <Galeria coleccion="autores" singular="Autor" :enTablaRelacional="true" />
</template>
