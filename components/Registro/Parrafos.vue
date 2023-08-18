<script setup lang="ts">
defineProps({
  datos: String,
  titulo: String,
});
</script>
<template>
  <section v-if="datos" class="seccion">
    <h3>{{ titulo }}</h3>
    <div v-html="datos" class="contenido singular"></div>
  </section>
</template>
