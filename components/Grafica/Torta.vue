<script setup>
import { numberLiteralTypeAnnotation } from '@babel/types';

const props = defineProps({
  totalObras: Number,
  datos: Array,
});

function convertirPorcentaje(props) {
  const total = totalObras(datos);
}
pie();
</script>

<template>
  <svg height="20" width="20">
    <circle id="base" r="10" cx="10" fill="white" />
  </svg>
</template>

<style>
#base {
  fill: var(--amarilloCrema);
}

#rebanada1 {
  fill: var(--amarilloJengibre);
}
#rebanads2 {
  fill: var(--amarillo);
}
</style>
