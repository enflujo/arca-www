<script setup lang="ts">
import { gql } from '~/utilidades/ayudas';

interface AgregdoColeccion {
  obras_aggregated: { count: { id: number } };
}

interface Esquema {
  todos: { count: { id: number } }[];
  gestos1: AgregdoColeccion[];
  gestos2: AgregdoColeccion[];
  fechas: any;
}

const agregados = gql`
  query {
    todos: obras_aggregated {
      count {
        id
      }
    }

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

const { todos, gestos1, gestos2, fechas } = await obtenerDatos<any>('agregados', agregados);
const limites = { min: fechas[0].group.fecha_inicial, max: fechas.slice(-1)[0].group.fecha_inicial, distancia: 0 };
// console.log(gestos1);
limites.distancia = limites.max - limites.min;
// const pasoX = 100 / limites.distancia;
// const posX = (año: number) => `${(año - limites.min) * pasoX}%`;
// const alto = (valor: number) => `${valor}px`;
definePageMeta({ layout: 'default' });

async function buscarGesto(id: number) {
  const { data } = obtenerDatosAsinc(
    'busqueda',
    gql`
    query {
      categorias1(filter: { id: {_eq: ${id}}}) {
        nombre
      }
    }
  `
  );

  console.log(data.value.categorias1[0].nombre);
}
/**
 * En Cliente
 */
class ObraPunto {
  x: number;
  y: number;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.color = '#000';
  }
}
const lienzo: Ref<HTMLCanvasElement | null> = ref(null);
let ctx: CanvasRenderingContext2D;
const lienzo2: Ref<HTMLCanvasElement | null> = ref(null);
let ctx2: CanvasRenderingContext2D;
const puntos: ObraPunto[] = [];
const total = computed(() => todos[0].count.id);
let ancho = 1200;

const alto = 800;
const colores = (i: number) =>
  [
    '#FF6633',
    '#FFB399',
    '#FF33FF',
    '#FFFF99',
    '#00B3E6',
    '#E6B333',
    '#3366E6',
    '#999966',
    '#99FF99',
    '#B34D4D',
    '#80B300',
    '#809900',
    '#E6B3B3',
    '#6680B3',
    '#66991A',
    '#FF99E6',
    '#CCFF1A',
    '#FF1A66',
    '#E6331A',
    '#33FFCC',
    '#66994D',
    '#B366CC',
    '#4D8000',
    '#B33300',
    '#CC80CC',
    '#66664D',
    '#991AFF',
    '#E666FF',
    '#4DB3FF',
    '#1AB399',
    '#E666B3',
    '#33991A',
    '#CC9999',
    '#B3B31A',
    '#00E680',
    '#4D8066',
    '#809980',
    '#E6FF80',
    '#1AFF33',
    '#999933',
    '#FF3380',
    '#CCCC00',
    '#66E64D',
    '#4D80CC',
    '#9900B3',
    '#E64D66',
    '#4DB380',
    '#FF4D4D',
    '#99E6E6',
    '#6666FF',
    '#FF6633',
    '#FFB399',
    '#FF33FF',
    '#FFFF99',
    '#00B3E6',
    '#E6B333',
    '#3366E6',
    '#999966',
    '#99FF99',
    '#B34D4D',
    '#80B300',
    '#809900',
    '#E6B3B3',
    '#6680B3',
    '#66991A',
    '#FF99E6',
    '#CCFF1A',
    '#FF1A66',
    '#E6331A',
    '#33FFCC',
    '#66994D',
    '#B366CC',
    '#4D8000',
    '#B33300',
    '#CC80CC',
    '#66664D',
    '#991AFF',
    '#E666FF',
    '#4DB3FF',
    '#1AB399',
    '#E666B3',
    '#33991A',
    '#CC9999',
    '#B3B31A',
    '#00E680',
    '#4D8066',
    '#809980',
    '#E6FF80',
    '#1AFF33',
    '#999933',
    '#FF3380',
    '#CCCC00',
    '#66E64D',
    '#4D80CC',
    '#9900B3',
    '#E64D66',
    '#4DB380',
    '#FF4D4D',
    '#99E6E6',
    '#6666FF',
    '#FF6633',
    '#FFB399',
    '#FF33FF',
    '#FFFF99',
    '#00B3E6',
    '#E6B333',
    '#3366E6',
    '#999966',
    '#99FF99',
    '#B34D4D',
    '#80B300',
    '#809900',
    '#E6B3B3',
    '#6680B3',
    '#66991A',
    '#FF99E6',
    '#CCFF1A',
    '#FF1A66',
    '#E6331A',
    '#33FFCC',
    '#66994D',
    '#B366CC',
    '#4D8000',
    '#B33300',
    '#CC80CC',
    '#66664D',
    '#991AFF',
    '#E666FF',
    '#4DB3FF',
    '#1AB399',
    '#E666B3',
    '#33991A',
    '#CC9999',
    '#B3B31A',
    '#00E680',
    '#4D8066',
    '#809980',
    '#E6FF80',
    '#1AFF33',
    '#999933',
    '#FF3380',
    '#CCCC00',
    '#66E64D',
    '#4D80CC',
    '#9900B3',
    '#E64D66',
    '#4DB380',
    '#FF4D4D',
    '#99E6E6',
    '#6666FF',
    '#FF6633',
    '#FFB399',
    '#FF33FF',
    '#FFFF99',
    '#00B3E6',
    '#E6B333',
    '#3366E6',
    '#999966',
    '#99FF99',
    '#B34D4D',
    '#80B300',
    '#809900',
    '#E6B3B3',
    '#6680B3',
    '#66991A',
    '#FF99E6',
    '#CCFF1A',
    '#FF1A66',
    '#E6331A',
    '#33FFCC',
    '#66994D',
    '#B366CC',
    '#4D8000',
    '#B33300',
    '#CC80CC',
    '#66664D',
    '#991AFF',
    '#E666FF',
    '#4DB3FF',
    '#1AB399',
    '#E666B3',
    '#33991A',
    '#CC9999',
    '#B3B31A',
    '#00E680',
    '#4D8066',
    '#809980',
    '#E6FF80',
    '#1AFF33',
    '#999933',
    '#FF3380',
    '#CCCC00',
    '#66E64D',
    '#4D80CC',
    '#9900B3',
    '#E64D66',
    '#4DB380',
    '#FF4D4D',
    '#99E6E6',
    '#6666FF',
  ][i];

onMounted(() => {
  if (!lienzo.value || !lienzo2.value) return;
  ctx = lienzo.value.getContext('2d') as CanvasRenderingContext2D;
  ctx2 = lienzo2.value.getContext('2d') as CanvasRenderingContext2D;

  const len = total.value;

  const dimCuadrado = Math.ceil(Math.sqrt(total.value));

  // for (let x = 0; x < dimCuadrado; x++) {
  //   for (let y = 0; y < dimCuadrado; y++) {
  //     console.log(x, y);
  //   }
  // }

  const sumaGestos = gestos1.reduce((acumulado, actual) => {
    return acumulado + actual.count.id;
  }, 0);
  console.log('obras con gesto1', sumaGestos);

  for (let i = 0; i < len; i++) {
    const x = (Math.random() * ancho - 1) | 0;
    const y = (Math.random() * alto - 1) | 0;

    puntos.push(new ObraPunto(x, y));
  }

  let totalConGesto1 = 0;
  let n = 0;
  console.log(gestos1);
  gestos1.forEach((gesto1: any, i: number) => {
    const conteo = gesto1.count.id;
    const id = gesto1.group.gesto1;

    const color = colores(i);

    if (color) {
      const len = n + conteo;
      console.log(n, len, conteo);

      for (let x = n; x < len; x++) {
        // console.log(n);
        puntos[x].color = color;
      }
    }

    if (id) {
      totalConGesto1 += conteo;
    }

    n += conteo;
  });

  console.log(puntos);
  escalar();

  window.addEventListener('resize', escalar);
});

onUnmounted(() => {
  window.removeEventListener('resize', escalar);
});

function escalar() {
  if (!lienzo.value || !lienzo2.value) return;
  ancho = 1200;
  lienzo.value.width = ancho;
  lienzo.value.height = alto;
  Object.assign(lienzo.value.style, {
    width: `${ancho}px`,
    height: `${alto}px`,
  });

  lienzo2.value.width = 600;
  lienzo2.value.height = 600;
  Object.assign(lienzo2.value.style, {
    width: `${600}px`,
    height: `${600}px`,
  });

  pintar();
}

function pintar() {
  if (!ctx) return;
  const len = total.value;
  let color = puntos[0].color;
  ctx.fillStyle = color;

  ctx.beginPath();
  for (let i = 0; i < len; i++) {
    const punto = puntos[i];
    ctx.rect(punto.x, punto.y, 1.5, 1.5);

    if (punto.color !== color) {
      ctx.fill();
      color = punto.color;
      ctx.fillStyle = color;
      // ctx.closePath();
      ctx.beginPath();
    }
  }
  // ctx.fill();
  // ctx.fill();
}

function cuadroGestos() {
  const totalGestos = gestos1.length;
  const max = Math.max();
}
</script>

<template>
  <ul>
    <!-- <li @click="buscarGesto(1)">gestos 1</li> -->
    <li @click="cuadroGestos()">gestos 1</li>
  </ul>
  <canvas ref="lienzo" id="lienzo"></canvas>
  <canvas ref="lienzo2" id="lienzo2"></canvas>
  <!-- <h1>Obras</h1>
  <div class="contenedorLinea">
    <span class="nodo" v-for="fecha in fechas" :style="`left:${posX(fecha.group.fecha_inicial)}`">
      <span class="barra" :style="`height:${alto(fecha.count.id)}`"></span>
      <span class="fecha">{{ fecha.group.fecha_inicial }}</span>
    </span>
  </div> -->
</template>

<style lang="scss" scoped>
#lienzo {
  // display: block;

  // width: 100%;
}

canvas {
  display: inline-block;
}
</style>
