<script setup>
defineProps({
  datos: Object | String,
  titulo: String,
  ruta: String,
});
</script>

<template>
  <section v-if="datos" class="seccion">
    <h3>{{ titulo }}</h3>

    <template v-if="typeof datos === 'string'">
      <p class="contenido singular">{{ datos }}</p>
    </template>

    <template v-else-if="datos">
      <NuxtLink :to="`/${ruta}/${datos.slug}`" class="contenido singular">
        {{ datos.nombre }}
      </NuxtLink>
    </template>
  </section>
</template>
