<script setup lang="ts">
import type { CamposBasicosURL } from '~/tipos';

interface Props {
  datos: CamposBasicosURL | string;
  titulo: string;
  ruta?: string;
}
defineProps<Props>();
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
