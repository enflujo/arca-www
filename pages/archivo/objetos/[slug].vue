<script setup>
definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <Galeria coleccion="objetos" :enTablaRelacional="true" singular="Objeto" />
</template>
