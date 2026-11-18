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
    <!-- Lugar › ciudad › país, cada uno como etiqueta enlazada. -->
    <p class="contenido lugares">
      <template v-for="(lugar, i) in datos.procesado" :key="`ubicacion${lugar.url}`">
        <span v-if="i > 0" class="separador" aria-hidden="true">›</span>
        <NuxtLink :to="lugar.url" class="etiqueta">{{ lugar.nombre }}</NuxtLink>
      </template>
    </p>
    <!-- El mapa de la obra va debajo de la imagen (components/Registro/MapaObra.vue). -->
  </section>
</template>

<style lang="scss" scoped>
.lugares {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 5px;
}

.separador {
  color: var(--etiqueta);
}

.etiqueta {
  @include etiquetaMeta;
}
</style>
