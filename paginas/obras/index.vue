<script setup lang="ts">
import { gql } from '~/utilidades/ayudas';

interface Esquema {
  obras_aggregated: { count: { id: number } }[];
}

const total = ref(0);
const Obras = gql`
  query {
    obras_aggregated {
      count {
        id
      }
    }
  }
`;

const { obras_aggregated } = await obtenerDatos<Esquema>('obras', Obras);

total.value = obras_aggregated[0].count.id;

definePageMeta({ layout: 'archivo' });
</script>

<template>
  <h1>Obras</h1>
  <GraficaContador :numero-obras="total" />
</template>
