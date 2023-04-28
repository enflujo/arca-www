<script setup>
definePageMeta({ layout: 'archivo', keepalive: true });
</script>

<template>
  <Galeria coleccion="objetos" :enTablaRelacional="true" singular="Objeto" />
</template>
