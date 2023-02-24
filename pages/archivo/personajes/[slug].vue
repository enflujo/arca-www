<script setup>
definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <Galeria coleccion="personajes" :enTablaRelacional="true" singular="Personaje" />
</template>
