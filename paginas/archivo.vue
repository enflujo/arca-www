<script setup lang="ts">
import { convertirEscala } from '@enflujo/alquimia';
import { usarGeneral } from '~/cerebros/general';
import { gql } from '~/utilidades/ayudas';

interface AgregdoColeccion {
  obras_aggregated: { count: { id: number } };
}

interface Esquema {
  total: { count: { id: number } }[];
  gestos1: AgregdoColeccion[];
  gestos2: AgregdoColeccion[];
  fechas: any;
}

const agregados = gql`
  query {
    total: obras_aggregated {
      count {
        id
      }
    }

    fechas: obras_aggregated(groupBy: ["fecha_inicial"], limit: -1, sort: ["fecha_inicial"]) {
      group
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
  }
`;

const { total, gestos1, gestos2, fechas } = await obtenerDatos<any>('agregados', agregados);
const limites = { min: fechas[0].group.fecha_inicial, max: fechas.slice(-1)[0].group.fecha_inicial, distancia: 0 };
const obrasPorDecadas: { año: number; conteo: number }[] = [];

let maximoValor = 0;

const revisarMaximo = (valor: number) => {
  if (maximoValor < valor) {
    maximoValor = valor;
  }
};
const decada = (valor: number) => ((valor / 10) | 0) * 10;
fechas.forEach((fecha) => {
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
// console.log(gestos1);
limites.distancia = limites.max - limites.min;
// const pasoX = 100 / limites.distancia;
// const posX = (año: number) => `${(año - limites.min) * pasoX}%`;
// const alto = (valor: number) => `${valor}px`;
definePageMeta({ layout: 'default' });

// async function buscarGesto(id: number) {
//   const { data } = obtenerDatosAsinc(
//     'busqueda',
//     gql`
//     query {
//       categorias1(filter: { id: {_eq: ${id}}}) {
//         nombre
//       }
//     }
//   `
//   );

//   console.log(data.value.categorias1[0].nombre);
// }
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
const cerebroGeneral = usarGeneral();
const lienzo: Ref<HTMLCanvasElement | null> = ref(null);
let ctx: CanvasRenderingContext2D;
const lienzo2: Ref<HTMLCanvasElement | null> = ref(null);
let ctx2: CanvasRenderingContext2D;
const puntos: ObraPunto[] = [];
const totalObras = computed(() => total[0].count.id);
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
  // if (!lienzo.value || !lienzo2.value) return;
  // ctx = lienzo.value.getContext('2d') as CanvasRenderingContext2D;
  // ctx2 = lienzo2.value.getContext('2d') as CanvasRenderingContext2D;
  // const len = totalObras.value;
  // const dimCuadrado = Math.ceil(Math.sqrt(totalObras.value));
  // // for (let x = 0; x < dimCuadrado; x++) {
  // //   for (let y = 0; y < dimCuadrado; y++) {
  // //     console.log(x, y);
  // //   }
  // // }
  // // const sumaGestos = gestos1.reduce((acumulado, actual) => {
  // //   return acumulado + actual.count.id;
  // // }, 0);
  // // console.log('obras con gesto1', sumaGestos);
  // for (let i = 0; i < len; i++) {
  //   const x = (Math.random() * ancho - 1) | 0;
  //   const y = (Math.random() * alto - 1) | 0;
  //   puntos.push(new ObraPunto(x, y));
  // }
  // let totalConGesto1 = 0;
  // let n = 0;
  // gestos1.forEach((gesto1: any, i: number) => {
  //   const conteo = gesto1.count.id;
  //   const id = gesto1.group.gesto1;
  //   const color = colores(i);
  //   if (color) {
  //     const len = n + conteo;
  //     for (let x = n; x < len; x++) {
  //       puntos[x].color = color;
  //     }
  //   }
  //   if (id) {
  //     totalConGesto1 += conteo;
  //   }
  //   n += conteo;
  // });
  // escalar();
  // window.addEventListener('resize', escalar);
});

onUnmounted(() => {
  // window.removeEventListener('resize', escalar);
});

// function escalar() {
//   if (!lienzo.value || !lienzo2.value) return;
//   ancho = 1200;
//   lienzo.value.width = ancho;
//   lienzo.value.height = alto;
//   Object.assign(lienzo.value.style, {
//     width: `${ancho}px`,
//     height: `${alto}px`,
//   });

//   lienzo2.value.width = 600;
//   lienzo2.value.height = 600;
//   Object.assign(lienzo2.value.style, {
//     width: `${600}px`,
//     height: `${600}px`,
//   });

//   pintar();
// }

// function pintar() {
//   if (!ctx) return;
//   const len = totalObras.value;
//   let color = puntos[0].color;
//   ctx.fillStyle = color;

//   ctx.beginPath();
//   for (let i = 0; i < len; i++) {
//     const punto = puntos[i];
//     ctx.rect(punto.x, punto.y, 1.5, 1.5);

//     if (punto.color !== color) {
//       ctx.fill();
//       color = punto.color;
//       ctx.fillStyle = color;
//       // ctx.closePath();
//       ctx.beginPath();
//     }
//   }
//   // ctx.fill();
//   // ctx.fill();
// }
const listas: Ref<{ id: number; nombre: string }[][]> = ref([]);
const columna1: Ref<HTMLInputElement | undefined> = ref();
const columna2: Ref<HTMLInputElement | undefined> = ref();

async function abrirOpciones(numeroLista: number) {
  const seleccionador = numeroLista === 0 ? columna1 : columna2;
  const coleccion = seleccionador.value?.value;

  if (!coleccion || coleccion === 'inicio') return;

  const queryNormal = gql`
    query {
      ${coleccion}(filter: { obras: { id: {_nnull: true} } }, limit: -1) {
        id
        nombre
        ${coleccion === 'autores' ? 'apellido' : ''}
      }
    }`;

  const queryGestos = gql`
    query {
      gestos(limit: -1) {
        id
        nombre
      }
    }
  `;

  const query = coleccion === 'gestos' ? queryGestos : queryNormal;

  try {
    const datos = await pedirDatos<{ [coleccion: string]: { id: number; nombre: string; apellido?: string }[] }>(query);

    if (datos[coleccion]) {
      if (coleccion === 'autores') {
        datos.autores = datos.autores.map((a) => {
          return { id: a.id, nombre: `${a.nombre} ${a.apellido}` };
        });
      }

      listas.value[numeroLista] = datos[coleccion];

      if (numeroLista === 1) {
        const QueryRelaciones = gql`
          query {
            relaciones: obras_aggregated(groupBy: ["${columna1.value?.value}", "${columna2.value?.value}"], sort: "-count.id") {
              group
              count {id}
            }
          }
        `;

        try {
          const relaciones = await pedirDatos<any>(QueryRelaciones);
          console.log(relaciones);
        } catch (error) {
          console.error(error);
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
}
const lineas: Ref<{ año: number; conteo: number }[][]> = ref([]);

async function buscarCategoria(elemento: any, coleccion?: string) {
  console.log(elemento, coleccion);
  const Query = gql`
    query {
      obras(filter: { categoria1: { id: {_eq: "${elemento.id}" } }}, limit: -1, sort: ["fecha_inicial"]) {
        fecha_inicial
      }
    }
  `;
  const respuesta = await pedirDatos<{ obras: { fecha_inicial: number }[] }>(Query);

  if (!respuesta.obras.length) return;
  const fechas: { año: number; conteo: number }[] = [];
  respuesta.obras.forEach((obra) => {
    const existe = fechas.find((f) => f.año === obra.fecha_inicial);

    if (!existe) {
      fechas.push({ año: obra.fecha_inicial, conteo: 1 });
    } else {
      existe.conteo++;
    }
  });

  lineas.value.push(fechas);
}
const svgFechasExactas = ref();
function crearLinea(puntos: any) {
  const { width, height } = svgFechasExactas.value?.getBoundingClientRect();
  const x = (valor: number) => convertirEscala(valor, 0, 100, 0, width);
  const y = (valor: number) => convertirEscala(valor, 0, 100, 0, height);
  let linea = '';

  puntos.forEach((punto, i) => {
    if (i === 0) {
      linea += `M${x(ejeX(punto.año))} ${y(ejeY(punto.conteo))}`;
    } else {
      linea += ` L${x(ejeX(punto.año))} ${y(ejeY(punto.conteo))}`;
    }
  });

  linea += ' Z';

  return linea;
}
</script>

<template>
  <p class="contador">
    Actualmente hay <span class="resaltado">{{ totalObras }}</span> obras registradas en la coleccion
  </p>
  <div class="contenedorSVG">
    <svg v-if="obrasPorDecadas.length" class="contenedorLinea" ref="svgFechasExactas">
      <g v-for="obj in obrasPorDecadas" :style="`transform:translateX(${ejeX(obj.año)}%)`">
        <line class="barra" x1="0" :y1="`${ejeY(obj.conteo)}%`" x2="0" y2="90%" stroke="black"></line>
        <line class="guiaEje" x1="0" y1="91%" x2="0" y2="94%"></line>
        <text class="año" x="0" y="98%">{{ obj.año }}</text>
      </g>

      <line class="lineaGuia" x1="0" x2="100%" y1="92%" y2="92%"></line>

      <g v-for="(grupo, i) in lineas">
        <path
          :d="crearLinea(grupo)"
          vector-effect="non-scaling-stroke"
          :style="`fill: none; stroke: ${colores(i)}; stroke-width: 1`"
        ></path>
      </g>
    </svg>
  </div>

  <div class="contenedor">
    <div class="columna">
      <select class="buscarColeccion" ref="columna1" @change="abrirOpciones(0)">
        <option value="inicio">__</option>
        <option v-for="coleccion in cerebroGeneral.paginasArchivo" class="campoColeccion" :value="coleccion.coleccion">
          {{ coleccion.titulo }}
        </option>
      </select>

      <ul id="lista1" class="listaOpciones">
        <li v-for="elemento in listas[0]" @click="buscarCategoria(elemento, columna1?.value)">{{ elemento.nombre }}</li>
      </ul>
    </div>

    <svg class="conexiones"></svg>

    <div class="columna">
      <select class="buscarColeccion" ref="columna2" @change="abrirOpciones(1)">
        <option value="inicio">__</option>
        <option v-for="coleccion in cerebroGeneral.paginasArchivo" class="campoColeccion" :value="coleccion.coleccion">
          {{ coleccion.titulo }}
        </option>
      </select>

      <ul id="lista2" class="listaOpciones">
        <li v-for="elemento in listas[1]">{{ elemento.nombre }}</li>
      </ul>
    </div>
  </div>

  <!-- <canvas ref="lienzo" id="lienzo"></canvas>
  <canvas ref="lienzo2" id="lienzo2"></canvas> -->
</template>

<style lang="scss" scoped>
canvas {
  display: inline-block;
}

.contenedorSVG {
  height: 200px;
}

.contenedor {
  display: flex;

  .columna {
    // width: 30%;
  }
}

.buscarColeccion {
  width: 250px;
  padding: 0.5em;
  background-color: var(--verdeClaro);
  font-family: var(--fuenteMenu);
  cursor: pointer;
}

.campoColeccion {
  font-size: 0.85em;
  padding: 0.35em 0;
}

.contador {
  border: 2px solid;
  padding: 0.8em;
  display: inline-block;
}

.resaltado {
  font-weight: bold;
  font-size: 1.2em;
}

.listaOpciones {
  font-size: 0.85em;
  width: 250px;
  min-width: 200px;
}

#lista1 {
  text-align: right;
}

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
