<script setup lang="ts">
import type { Feature, Point } from 'geojson';

interface Props {
  datos?: { url: string; nombre: string }[];
  punto?: Feature<Point>;
  titulo: string;
}
defineProps<Props>();
</script>

<template>
  <section v-if="datos && datos.length" class="seccion">
    <h3>{{ titulo }}</h3>
    <p class="singular">
      <span v-for="(lugar, i) in datos" :key="`ubicacion${lugar.url}`">
        <span v-if="i > 0" class="separador">|</span>

        <NuxtLink :to="lugar.url"> {{ lugar.nombre }} </NuxtLink>
      </span>
    </p>
    <VistaMapaPunto v-if="punto && punto.geometry" :punto="punto" />
  </section>
</template>

<style lang="scss" scoped>
.separador {
  padding: 0 0.3em;
}
</style>
