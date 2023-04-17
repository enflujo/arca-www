<script setup>
import { convertirEscala, escalaColores } from '@enflujo/alquimia';
import { obtenerVariablesCSS } from '~~/utilidades/ayudas';

const contenedor = ref(null);

const datosOrdenados = ref([]);
const maximoObras = ref(0);
const seccionGrilla = ref(0);

let buscarColor;
let anchoLinea;

const props = defineProps({
  datos: Array,
  coleccion: String,
});

onMounted(() => {
  /**
   * Ordenar por cantidad de obras.
   */
  const ordenados = props.datos.sort((a, b) => b.obras_func.count - a.obras_func.count);
  const maximo = ordenados[0].obras_func.count;
  const maximoGrilla = Math.ceil(maximo / 1000) * 1000;
  const colorMin = obtenerVariablesCSS('--amarilloArena2');
  const colorMax = obtenerVariablesCSS('--rojoCerezo');

  buscarColor = escalaColores(1, maximo, colorMin, colorMax);
  anchoLinea = (cantidad) => convertirEscala(cantidad, 0, maximoGrilla, 0, 100) | 0;

  seccionGrilla.value = maximoGrilla / 10;
  maximoObras.value = maximo;
  datosOrdenados.value = ordenados;
});

function activar(evento, color) {
  const elemento = evento.target;
  const conteo = elemento.querySelector('.conteoObras');
  conteo.style.backgroundColor = color;
  elemento.classList.add('activo');
}

function desactivar(evento) {
  const elemento = evento.target;
  const conteo = elemento.querySelector('.conteoObras');
  conteo.style.backgroundColor = 'rgba(252, 252, 252, 0.65)';
  elemento.classList.remove('activo');
}
</script>

<template>
  <div id="contenedorGrafica" ref="contenedor">
    <ul>
      <li
        v-for="elemento in datosOrdenados"
        :key="elemento.slug"
        @mouseenter="activar($event, buscarColor(elemento.obras_func.count))"
        @mouseleave="desactivar"
      >
        <NuxtLink class="nombre fila" :to="elemento.url ? elemento.url : `/${props.coleccion}/${elemento.slug}`">
          {{ elemento.nombreCompleto ? elemento.nombreCompleto : elemento.nombre }}
        </NuxtLink>

        <NuxtLink
          class="elementoColombina fila"
          :to="elemento.url ? elemento.url : `/${props.coleccion}/${elemento.slug}`"
        >
          <GraficaColombina
            :ancho="anchoLinea(elemento.obras_func.count)"
            :color="buscarColor(elemento.obras_func.count)"
            :total="elemento.obras_func.count"
          />
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
