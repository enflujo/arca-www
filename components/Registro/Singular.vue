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

    <!-- Valor enlazado: etiqueta, igual que en los campos de lista. -->
    <div v-else-if="datos" class="contenido">
      <NuxtLink :to="`/${ruta}/${datos.slug}`" class="etiqueta">
        {{ datos.nombre }}
      </NuxtLink>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.etiqueta {
  @include etiquetaMeta;
}
</style>
