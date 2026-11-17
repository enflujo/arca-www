<script setup lang="ts">
import type { ImagenPagina } from '~/utilidades/contenidoCMS';

defineProps<{ imagen?: ImagenPagina }>();
</script>

<template>
  <figcaption v-if="imagen?.obra" class="creditoImagen">
    <NuxtLink :to="`/obras/${imagen.obra.registro}`">
      {{ imagen.obra.titulo }}<template v-if="imagen.obra.autor"> · {{ imagen.obra.autor }}</template> ·
      <span class="numero">Nº {{ imagen.obra.registro }}</span>
    </NuxtLink>
  </figcaption>
</template>
