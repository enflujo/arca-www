<script setup lang="ts">
import { gql } from '~/utilidades/ayudas';

interface AgregdoColeccion {
  obras_aggregated: { count: { id: number } }[];
}

interface Esquema {
  obras_aggregated: AgregdoColeccion;
}

const svgFechasExactas: Ref<(HTMLElement & SVGElement) | null> = ref(null);
const svgFechasPeriodos: Ref<(HTMLElement & SVGElement) | null> = ref(null);

const agregados = gql`
  query {
    obras_aggregated(groupBy: ["fecha_periodo", "fecha_inicial"], limit: -1, sort: ["fecha_inicial"]) {
      group
      count {
        id
      }
    }

    fechasPeriodos: obras_aggregated(
      groupBy: ["fecha_inicial", "fecha_final"]
      sort: "fecha_inicial"
      filter: { fecha_periodo: { _nnull: true } }
      limit: -1
    ) {
      group
      count {
        id
      }
    }
  }
`;

const { obras_aggregated, fechasPeriodos } = await obtenerDatos<any>('agregados', agregados);
console.log(fechasPeriodos);
// definePageMeta({ layout: 'archivo' });

const fechasExactas: { año: number; conteo: number }[] = [];
const fechasPeriodo: { año: number; conteo: number }[] = [];
const fechasEjeX: Ref<number[]> = ref([]);
const fechasEjeX2: Ref<number[]> = ref([]);

obras_aggregated.forEach((instancia) => {
  instancia.group.fecha_periodo
    ? fechasPeriodo.push({ año: +instancia.group.fecha_inicial, conteo: instancia.count.id })
    : fechasExactas.push({ año: +instancia.group.fecha_inicial, conteo: instancia.count.id });
});

const fechaMin = Math.min(fechasExactas[0].año, fechasPeriodo[0].año);
const fechaMax = Math.max(fechasExactas[fechasExactas.length - 1].año, fechasPeriodo[fechasPeriodo.length - 1].año);
const distancia = fechaMax - fechaMin;
const limiteY = 150; // cambiar a dinámico
const pasoX = 95 / distancia;
const pasoY = 100 / limiteY;
const ejeX = (valor: number) => 2.5 + (valor - fechaMin) * pasoX;
const ejeY = (valor: number) => 90 - valor * pasoY;

function siguienteNumeroCerrado(valor: number, redondearAl = 10) {
  return Math.round(valor / redondearAl) * redondearAl;
}

function fechasEje() {
  const ancho = svgFechasExactas.value?.clientWidth;
  const respuesta: number[] = [];

  if (ancho) {
    const a = siguienteNumeroCerrado(fechaMin);
    const b = siguienteNumeroCerrado(fechaMax);
    const dist = b - a;
    const anchoMax = 40;
    const saltos = siguienteNumeroCerrado((dist / (ancho / anchoMax)) | 0);

    for (let i = a; i <= b; i += saltos) {
      respuesta.push(i);
    }
  }

  return respuesta;
}

function fechasEje2() {
  const ancho = svgFechasPeriodos.value?.clientWidth;
  const respuesta: number[] = [];

  if (ancho) {
    const a = siguienteNumeroCerrado(fechaMin);
    const b = siguienteNumeroCerrado(fechaMax);
    const dist = b - a;
    const anchoMax = 40;
    const saltos = siguienteNumeroCerrado((dist / (ancho / anchoMax)) | 0);

    for (let i = a; i <= b; i += saltos) {
      respuesta.push(i);
    }
  }

  return respuesta;
}

onMounted(() => {
  fechasEjeX.value = fechasEje();
  fechasEjeX2.value = fechasEje2();
});
</script>

<template>
  <h1>Obras con fechas identificadas</h1>

  <svg class="contenedorLinea" ref="svgFechasExactas">
    <g v-for="obj in fechasExactas" :style="`transform:translateX(${ejeX(obj.año)}%)`">
      <line class="barra" x1="0" :y1="`${ejeY(obj.conteo)}%`" x2="0" y2="90%" stroke="black"></line>
    </g>

    <line class="lineaGuia" x1="0" x2="100%" y1="92%" y2="92%"></line>

    <g v-for="año in fechasEjeX" :style="`transform:translateX(${ejeX(año)}%)`">
      <line class="guiaEje" x1="0" y1="91%" x2="0" y2="94%"></line>
      <text class="año" x="0" y="98%">{{ año }}</text>
    </g>
  </svg>

  <svg class="contenedorLinea" ref="svgFechasPeriodos">
    <g v-for="obj in fechasPeriodo" :style="`transform:translateX(${ejeX(obj.año)}%)`">
      <line class="barra" x1="0" :y1="`${ejeY(obj.conteo)}%`" x2="0" y2="90%" stroke="black"></line>
    </g>

    <line class="lineaGuia" x1="0" x2="100%" y1="92%" y2="92%"></line>

    <g v-for="año in fechasEjeX2" :style="`transform:translateX(${ejeX(año)}%)`">
      <line class="guiaEje" x1="0" y1="91%" x2="0" y2="94%"></line>
      <text class="año" x="0" y="98%">{{ año }}</text>
    </g>
  </svg>

  <div class="bloquearSvg">
    <svg class="contenedorLinea2" ref="svgFechasPeriodosCurvas" viewBox="0 0 100 100" width="100%" height="100%">
      <path class="curvaPeriodo" d="M "></path>
    </svg>

    <svg class="contenedorLinea">
      <line class="lineaGuia" x1="0" x2="100%" y1="92%" y2="92%"></line>
      <g v-for="año in fechasEjeX" :style="`transform:translateX(${ejeX(año)}%)`">
        <line class="guiaEje" x1="0" y1="91%" x2="0" y2="94%"></line>
        <text class="año" x="0" y="98%">{{ año }}</text>
      </g>
    </svg>
  </div>
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
