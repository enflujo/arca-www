<script setup lang="ts">
import { gql } from '~/utilidades/ayudas';

interface AgregdoColeccion {
  obras_aggregated: { count: { id: number } }[];
}

interface Esquema {
  gestos1: AgregdoColeccion;
  gestos2: AgregdoColeccion;
}

const total = ref(0);
const agregados = gql`
  query {
    gestos1: obras_aggregated(groupBy: ["gesto1"], limit: -1) {
      group
      count {
        id
      }
    }

    gestos2: obras_aggregated(groupBy: ["gesto2"], limit: -1) {
      group
      count {
        id
      }
    }
  }
`;

const { gestos1, gestos2 } = await obtenerDatos<Esquema>('agregados', agregados);

definePageMeta({ layout: 'archivo' });
console.log(gestos1, gestos2);
</script>

<template>
  <h1>Obras</h1>
</template>
