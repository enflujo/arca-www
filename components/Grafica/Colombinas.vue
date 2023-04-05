<script setup>
import { convertirEscala, escalaColores } from '@enflujo/alquimia';
import { obtenerVariablesCSS } from '~~/utilidades/ayudas';

const contenedor = ref(null);
const anchoPantalla = ref(0);
const datosOrdenados = ref([]);
const maximoObras = ref(0);
const divisionesGrilla = [...Array(10).keys()];
const anchoGrilla = ref(0);
const seccionGrilla = ref(0);

let buscarColor;

const props = defineProps({
  datos: Array,
  coleccion: String,
});

watch(
  () => contenedor.value,
  () => {
    const ancho = contenedor.value.clientWidth;
    const maximoGrilla = Math.ceil(maximoObras.value / 1000) * 1000;
    const anchoGrillaTotal = convertirEscala(maximoGrilla, 1, maximoGrilla, 0, ancho / 1.5);
    anchoGrilla.value = anchoGrillaTotal;
    seccionGrilla.value = maximoGrilla / 10;
    anchoPantalla.value = ancho;
  }
);

function anchoLinea(cantidad) {
  const maximo = Math.ceil(maximoObras.value / 1000) * 1000;
  const ancho = anchoPantalla.value / 1.5;
  return convertirEscala(cantidad, 1, maximo, 0, ancho) | 0;
}

onMounted(() => {
  /**
   * Ordenar por cantidad de obras.
   */
  const ordenados = props.datos.sort((a, b) => b.obras_func.count - a.obras_func.count);
  const maximo = ordenados[0].obras_func.count;

  buscarColor = escalaColores(1, maximo, obtenerVariablesCSS('--amarilloArena2'), obtenerVariablesCSS('--rojoCerezo'));
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
        <NuxtLink
          class="nombre fila"
          :to="elemento.url ? elemento.url : `/archivo/${props.coleccion}/${elemento.slug}`"
        >
          {{ elemento.nombreCompleto ? elemento.nombreCompleto : elemento.nombre }}
        </NuxtLink>

        <NuxtLink
          class="elementoColombina fila"
          :to="elemento.url ? elemento.url : `/archivo/${props.coleccion}/${elemento.slug}`"
        >
          <span class="colombina">
            <span
              class="lineaColombina"
              :style="`width:${anchoLinea(elemento.obras_func.count)}px; background-color:${buscarColor(
                elemento.obras_func.count
              )}`"
            ></span>
            <span class="circuloColombina" :style="`background-color:${buscarColor(elemento.obras_func.count)}`"></span>
            <span class="conteoObras">
              {{ elemento.obras_func.count }}
            </span>
          </span>
        </NuxtLink>
      </li>
    </ul>

    <div id="grilla" :style="`width:${anchoGrilla}px`">
      <p id="leyendaEjeX">Cantidad de obras</p>
      <span
        class="divisionGrilla"
        v-for="i in divisionesGrilla"
        :key="`división ${i}`"
        :style="`width:${seccionGrilla}px`"
      >
        <span class="valorGrilla">
          {{ seccionGrilla * i }}
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

    &.activo {
      .conteoObras {
        color: white;
      }

      .nombre {
        // Usamos sombra para no tener que usar "bold" ya que este hace que se partan las lineas. No es una solución perfecta pero mejor que calcular anchos para usar bold.
        text-shadow: -0.5px 0px 0px #000000;
      }
    }

    &:hover {
      background-color: var(--verdeResaltar);
      .circuloColombina {
        height: 16px;
        width: 16px;
      }
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
.colombina {
  display: flex;
  align-items: center;

  .lineaColombina {
    display: block;
    height: 3px;
  }
  .circuloColombina {
    display: block;
    height: 8px;
    width: 8px;
    border-radius: 50%;
  }

  .conteoObras {
    color: #788989;
    font-size: 0.75em;
    background-color: rgba(252, 252, 252, 0.65);
    padding: 0.4em;
    margin-left: 0.7em;
    border-radius: 6px;
  }
}

#grilla {
  border-top: #788989d2 dashed 1px;
  display: flex;
  justify-content: flex-start;
  width: calc(100vw / 1.5);
  height: 100%;
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
    border-right: #788989d2 solid 1px;
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
