<script setup lang="ts">
interface Props {
  numeroObras: number;
}
defineProps<Props>();
</script>

<template>
  <p class="contador">
    <span class="conteo">{{ numeroObras }}</span> obras en la colección
  </p>
</template>

<style lang="scss" scoped>
.contador {
  padding: 0.5em 1.1em;
  border: 1px solid var(--borde);
  border-radius: 999px;
  background-color: var(--papel);
  display: inline-block;
  margin: 0.3em 0 1em 0;
  color: var(--textoSuave);
}

.conteo {
  font-family: var(--fuenteSerif);
  font-size: 1.25em;
  color: var(--ocre);
}
</style>
