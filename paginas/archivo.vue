<script setup lang="ts">
import { gql } from '~/utilidades/ayudas';

interface AgregdoColeccion {
  obras_aggregated: { count: { id: number } }[];
}

interface Esquema {
  gestos1: AgregdoColeccion;
  gestos2: AgregdoColeccion;
  fechas: any;
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

    fechas: obras_aggregated(
      groupBy: ["fecha_periodo", "fecha_inicial", "fecha_final"]
      limit: -1
      sort: ["fecha_inicial"]
    ) {
      group
      count {
        id
      }
    }
  }
`;

const { gestos1, gestos2, fechas } = await obtenerDatos<Esquema>('agregados', agregados);

const limites = { min: fechas[0].group.fecha_inicial, max: fechas.slice(-1)[0].group.fecha_inicial, distancia: 0 };
limites.distancia = limites.max - limites.min;
const pasoX = 100 / limites.distancia;
const posX = (año: number) => `${(año - limites.min) * pasoX}%`;
const alto = (valor: number) => `${valor}px`;
definePageMeta({ layout: 'archivo' });
console.log(limites, fechas, pasoX);
</script>

<template>
  <h1>Obras</h1>
  <div class="contenedorLinea">
    <span class="nodo" v-for="fecha in fechas" :style="`left:${posX(fecha.group.fecha_inicial)}`">
      <span class="barra" :style="`height:${alto(fecha.count.id)}`"></span>
      <span class="fecha">{{ fecha.group.fecha_inicial }}</span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.contenedorLinea {
  width: 100%;
  // overflow: hidden;
  position: relative;
}

.nodo {
  border: 1px dotted;
  position: absolute;
  display: block;

  .barra {
    width: 2px;
    background-color: black;
    display: inline-block;
  }
}
</style>
