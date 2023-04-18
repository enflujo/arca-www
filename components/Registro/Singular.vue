<script setup>
defineProps({
  datos: Object,
  titulo: String,
  ruta: String,
  texto: String,
});
</script>

<template>
  <section v-if="datos || texto">
    <h3>{{ titulo }}</h3>

    <template v-if="texto">
      <p class="contenido">{{ texto }}</p>
    </template>

    <template v-else-if="datos">
      <NuxtLink :to="`/${ruta}/${datos.slug}`" class="contenido">
        {{ datos.nombre }}
      </NuxtLink>
    </template>
  </section>
</template>
