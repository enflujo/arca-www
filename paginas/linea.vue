<script setup lang="ts">
import { convertirEscala } from '@enflujo/alquimia';
import { gql } from '~/utilidades/ayudas';

interface AgregdoColeccion {
  obras_aggregated: {
    group: { fecha_inicial: number };
    count: { id: number };
  }[];
}

interface Esquema {
  obras_aggregated: AgregdoColeccion;
}

const svgFechasExactas: Ref<(HTMLElement & SVGElement) | null> = ref(null);
const decada = (valor: number) => ((valor / 10) | 0) * 10;

const agregados = gql`
  query {
    obras_aggregated(groupBy: ["fecha_inicial"], limit: -1, sort: ["fecha_inicial"]) {
      group
      count {
        id
      }
    }
  }
`;

const { obras_aggregated } = await obtenerDatos<AgregdoColeccion>('agregados', agregados);

// definePageMeta({ layout: 'archivo' });
const obrasPorDecadas: { año: number; conteo: number }[] = [];
let maximoValor = 0;

const revisarMaximo = (valor: number) => {
  if (maximoValor < valor) {
    maximoValor = valor;
  }
};

obras_aggregated.forEach((fecha) => {
  const año = decada(fecha.group.fecha_inicial);
  const existe = obrasPorDecadas.find((fecha) => fecha.año === año);

  if (!existe) {
    obrasPorDecadas.push({ año, conteo: fecha.count.id });
    revisarMaximo(fecha.count.id);
  } else {
    existe.conteo += fecha.count.id;
    revisarMaximo(existe.conteo);
  }
});

const fechaMin = obrasPorDecadas[0].año;
const fechaMax = obrasPorDecadas[obrasPorDecadas.length - 1].año;
const distancia = fechaMax - fechaMin;
const limiteY = 150; // cambiar a dinámico
const pasoX = 95 / distancia;
const pasoY = 100 / limiteY;
const ejeX = (valor: number) => 2.5 + (valor - fechaMin) * pasoX;
const ejeY = (valor: number) => 90 - convertirEscala(valor, 0, maximoValor, 0, 200) * pasoY;

onMounted(() => {});
</script>

<template>
  <h1>Obras con fechas identificadas</h1>

  <svg v-if="obrasPorDecadas.length" class="contenedorLinea" ref="svgFechasExactas">
    <g v-for="obj in obrasPorDecadas" :style="`transform:translateX(${ejeX(obj.año)}%)`">
      <line class="barra" x1="0" :y1="`${ejeY(obj.conteo)}%`" x2="0" y2="90%" stroke="black"></line>
      <line class="guiaEje" x1="0" y1="91%" x2="0" y2="94%"></line>
      <text class="año" x="0" y="98%">{{ obj.año }}</text>
    </g>

    <line class="lineaGuia" x1="0" x2="100%" y1="92%" y2="92%"></line>
  </svg>
</template>

<style lang="scss" scoped>
.bloquearSvg {
  width: 90vw;
  height: 200px;
  display: block;
  position: relative;
  margin: 0 auto;

  svg {
    position: absolute;
    top: 0;
    left: 0;
  }
}

.contenedorLinea {
  display: flex;
  flex-wrap: nowrap;
  position: relative;
  width: 90vw;
  height: 200px;
  margin: 0 auto;
}

.año {
  font-size: 10px;
  text-anchor: middle;
}

.barra {
  stroke-width: 2px;
  stroke: rgb(59, 131, 176);
}

.curvaPeriodo {
  stroke: rgb(116, 53, 194);
  fill: transparent;
}

.lineaGuia {
  stroke: black;
  stroke-width: 0.5px;
}

.guiaEje {
  stroke: black;
  stroke-width: 1px;
}

.bloque {
  font-size: 0.4em;
  position: absolute;

  overflow: hidden;

  .fecha {
    margin: 0 0.2em;
  }
}
</style>
