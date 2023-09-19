<script setup lang="ts">
const props = defineProps({
  numeroObras: Number,
});
</script>

<template>
  <p class="contador">
    <span class="conteo">{{ props.numeroObras }}</span> obras en la colección
  </p>
</template>

<style lang="scss" scoped>
.contador {
  padding: 0.7em;
  border: 2px solid $profundidad;
  display: inline-block;
  margin: 0.3em 0 1em 0;
}

.conteo {
  font-weight: bold;
}
</style>
