<script setup>
definePageMeta({ layout: 'archivo', keepalive: true });
</script>

<template>
  <Galeria coleccion="personajes" :enTablaRelacional="true" singular="Personaje" />
</template>
