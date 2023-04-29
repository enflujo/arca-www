<script setup>
import { convertirEscala, escalaColores } from '@enflujo/alquimia';
import { obtenerVariablesCSS } from '~~/utilidades/ayudas';

const contenedor = ref(null);

const datosOrdenados = ref([]);
const maximoObras = ref(0);
const seccionGrilla = ref(0);
const colores = { min: obtenerVariablesCSS('--amarilloArena2'), max: obtenerVariablesCSS('--rojoCerezo') };

let buscarColor;
let anchoLinea;

const props = defineProps({
  datos: Array,
  coleccion: String,
});

watch(() => props.datos, procesarDatos);
onMounted(procesarDatos);

function procesarDatos() {
  /**
   * Ordenar por cantidad de obras.
   */
  let ordenados = [];
  let maximo = 0;
  if (props.coleccion === 'gestos') {
    ordenados = props.datos.sort((a, b) => {
      const _b = Math.max(b.obras_gesto_1_func.count, b.obras_gesto_2_func.count, b.obras_gesto_3_func.count);
      const _a = Math.max(a.obras_gesto_1_func.count, a.obras_gesto_2_func.count, a.obras_gesto_3_func.count);
      return _b - _a;
    });
    const { obras_gesto_1_func, obras_gesto_2_func, obras_gesto_3_func } = ordenados[0];
    maximo = Math.max(+obras_gesto_1_func.count, +obras_gesto_2_func.count, +obras_gesto_3_func.count);
  } else {
    ordenados = props.datos.sort((a, b) => b.obras_func.count - a.obras_func.count);
    maximo = ordenados[0].obras_func.count;
  }

  const maximoGrilla = Math.ceil(maximo / 1000) * 1000;

  buscarColor = escalaColores(1, maximo, colores.min, colores.max);
  anchoLinea = (cantidad) => convertirEscala(cantidad, 0, maximoGrilla, 0, 100) | 0;

  seccionGrilla.value = maximoGrilla / 10;
  maximoObras.value = maximo;
  datosOrdenados.value = ordenados;
}

function activar(evento) {
  const elemento = evento.target;
  elemento.classList.add('activo');
}

function desactivar(evento) {
  const elemento = evento.target;
  elemento.classList.remove('activo');
}
</script>

<template>
  <div id="contenedorGrafica" ref="contenedor">
    <ul>
      <li v-for="elemento in datosOrdenados" :key="elemento.slug" @mouseenter="activar" @mouseleave="desactivar">
        <NuxtLink class="nombre fila" :to="elemento.url ? elemento.url : `/${props.coleccion}/${elemento.slug}`">
          {{ elemento.nombreCompleto ? elemento.nombreCompleto : elemento.nombre }}
        </NuxtLink>

        <NuxtLink
          class="elementoColombina fila"
          :to="elemento.url ? elemento.url : `/${props.coleccion}/${elemento.slug}`"
        >
          <template v-if="coleccion === 'gestos'">
            <GraficaColombina
              :ancho="anchoLinea(elemento.obras_gesto_1_func.count)"
              :color="buscarColor(elemento.obras_gesto_1_func.count)"
              :total="elemento.obras_gesto_1_func.count"
            />
            <GraficaColombina
              :ancho="anchoLinea(elemento.obras_gesto_2_func.count)"
              :color="buscarColor(elemento.obras_gesto_2_func.count)"
              :total="elemento.obras_gesto_2_func.count"
            />
            <GraficaColombina
              :ancho="anchoLinea(elemento.obras_gesto_3_func.count)"
              :color="buscarColor(elemento.obras_gesto_3_func.count)"
              :total="elemento.obras_gesto_3_func.count"
            />
          </template>
          <template v-else>
            <GraficaColombina
              :ancho="anchoLinea(elemento.obras_func.count)"
              :color="buscarColor(elemento.obras_func.count)"
              :total="elemento.obras_func.count"
            />
          </template>
        </NuxtLink>
      </li>
    </ul>

    <div id="grilla">
      <p id="leyendaEjeX">Cantidad de obras</p>
      <span class="divisionGrilla" v-for="i in 10" :key="`división ${i}`">
        <span class="valorGrilla">
          {{ seccionGrilla * (i - 1) }}
        </span>
      </span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#contenedorGrafica {
  position: relative;
  margin-top: 2em;
}

ul {
  display: table;
  width: 100%;
  position: relative;
  margin-top: 2em;
  padding-top: 0.7em;
  z-index: 2;

  li {
    display: table-row;

    &:hover {
      background-color: var(--verdeResaltar);
    }
  }
  .fila {
    display: table-cell;
    vertical-align: middle;
  }

  .nombre {
    text-align: right;
    padding-right: 0.5em;
    font-family: var(--fuenteMenu);
    font-weight: var(--fuenteMenuPeso);
    width: 200px;
    font-size: 0.8em;
    line-height: 1.8;
  }
}

#grilla {
  border-top: rgba($profundidad, 0.1) dashed 1px;
  border-left: rgba($profundidad, 0.1) solid 1px;
  display: flex;
  justify-content: flex-start;
  height: 100%;
  width: calc(100% - 200px);
  position: absolute;
  top: 0;
  left: 200px;
  font-size: 0.7em;
  overflow: visible;
  color: #788989d2;
  pointer-events: none;
  z-index: 1;

  .divisionGrilla {
    display: block;
    border-right: rgba($profundidad, 0.1) solid 1px;
    width: 10%;
  }

  .valorGrilla {
    position: absolute;
    top: -1.5em;
  }
}

#leyendaEjeX {
  position: absolute;
  top: -0.8em;
  left: -5px;
  width: 190px;
  transform: translateX(-100%);
  text-align: right;
  font-size: 0.8em;
  color: #788989d2;
}
</style>
