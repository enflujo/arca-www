<script setup>
definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <Galeria coleccion="descriptores" singular="Descriptor" :enTablaRelacional="true" />
</template>
