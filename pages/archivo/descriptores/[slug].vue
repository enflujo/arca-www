<script setup>
definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <Galeria coleccion="descriptores" paginaActual="Descriptores" singular="Descriptor" :enTablaRelacional="true" />
</template>
