<script setup lang="ts">
interface Props {
  titulo: string;
  datos?: string | { descripcion: string };
}
const props = defineProps<Props>();

function aplanar() {
  if (typeof props.datos === 'string') {
    return props.datos;
  } else if (props.datos?.descripcion) {
    return props.datos.descripcion;
  }
}
</script>
<template>
  <section v-if="datos" class="seccion">
    <h3>{{ titulo }}</h3>
    <div v-html="aplanar()" class="contenido singular"></div>
  </section>
</template>
