<script setup lang="ts">
import type { Point } from 'geojson';
import type { UbicacionProcesada } from '~/tipos';

interface Props {
  datos?: { geo?: Point; procesado: UbicacionProcesada[] };
  titulo: string;
}

defineProps<Props>();
</script>

<template>
  <section v-if="datos && datos.procesado.length" class="seccion">
    <h3>{{ titulo }}</h3>
    <p class="singular">
      <span v-for="(lugar, i) in datos.procesado" :key="`ubicacion${lugar.url}`">
        <span v-if="i > 0" class="separador">|</span>

        <NuxtLink :to="lugar.url"> {{ lugar.nombre }} </NuxtLink>
      </span>
    </p>

    <VistaMapaPunto v-if="datos.geo" :punto="datos.geo" />
  </section>
</template>

<style lang="scss" scoped>
.separador {
  padding: 0 0.3em;
}
</style>
