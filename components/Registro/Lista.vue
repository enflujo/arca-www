<script setup>
const props = defineProps({
  datos: Array,
  titulo: String,
  relacion: String,
  ruta: String,
});

const url = (elemento) => {
  if (elemento.ruta) return elemento.ruta;
  return `/${props.ruta}/${elemento[props.relacion].slug}`;
};
</script>

<template>
  <section v-if="datos.length">
    <h3>{{ titulo }}</h3>
    <ul class="lista contenido">
      <li v-for="(elemento, i) in datos" :key="`elemento${ruta}${i}`">
        <NuxtLink :to="url(elemento)">
          {{ relacion ? elemento[relacion].nombre : elemento.nombre }}
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped></style>
