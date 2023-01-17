<script setup>
definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <Galeria
    coleccion="caracteristicas"
    paginaActual="Características Particulares"
    singular="Característica Particular"
    :enTablaRelacional="true"
  />
</template>
