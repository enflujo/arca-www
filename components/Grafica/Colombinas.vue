<script setup>
import { convertirEscala, escalaColores } from '@enflujo/alquimia';
import { usarArchivo } from '~~/cerebros/archivo';
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

function anchoLinea(cantidad) {
  const maximo = Math.ceil(maximoObras.value / 1000) * 1000;
  const ancho = anchoPantalla.value / 1.5;
  return convertirEscala(cantidad, 1, maximo, 0, ancho) | 0;
}

onMounted(() => {
  /**
   * Ordenar por cantidad de obras en el país.
   */
  const ordenados = props.datos.sort((a, b) => b.obras_func.count - a.obras_func.count);
  const maximo = ordenados[0].obras_func.count;
  const ancho = contenedor.value.clientWidth;
  const maximoGrilla = Math.ceil(maximo / 1000) * 1000;
  const anchoGrillaTotal = convertirEscala(maximoGrilla, 1, maximoGrilla, 0, ancho / 1.5);

  buscarColor = escalaColores(1, maximo, obtenerVariablesCSS('--amarilloArena2'), obtenerVariablesCSS('--rojoCerezo'));
  anchoGrilla.value = anchoGrillaTotal;
  seccionGrilla.value = maximoGrilla / 10;
  maximoObras.value = maximo;
  datosOrdenados.value = ordenados;
  anchoPantalla.value = ancho;
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
  conteo.style.backgroundColor = 'transparent';
  elemento.classList.remove('activo');
}
</script>

<template>
  <div id="contenedorGrafica">
    <div id="contenedorGrilla">
      <div id="grilla" :style="`width:${anchoGrilla}px`">
        <span
          class="divisionGrilla"
          v-for="i in divisionesGrilla"
          :key="`división ${i}`"
          :style="`width:${seccionGrilla}px`"
        >
          <p class="valorGrilla">
            {{ seccionGrilla * i }}
          </p>
        </span>
      </div>
      <p id="leyendaEjeX">Cantidad de obras</p>
    </div>

    <ul ref="contenedor">
      <li
        v-for="elemento in datosOrdenados"
        :key="elemento.slug"
        @mouseenter="activar($event, buscarColor(elemento.obras_func.count))"
        @mouseleave="desactivar"
      >
        <NuxtLink class="nombre fila" :to="`/archivo/${props.coleccion}/${elemento.slug}`">{{
          elemento.nombre
        }}</NuxtLink>

        <NuxtLink class="elementoColombina fila" :to="`/archivo/${props.coleccion}/${elemento.slug}`">
          <div class="colombina">
            <span
              class="lineaColombina"
              :style="`width:${anchoLinea(elemento.obras_func.count)}px; background-color:${buscarColor(
                elemento.obras_func.count
              )}`"
            ></span>
            <span class="circuloColombina" :style="`background-color:${buscarColor(elemento.obras_func.count)}`"></span>
            <div class="conteoObras">
              {{ elemento.obras_func.count }}
            </div>
          </div>
        </NuxtLink>
      </li>
    </ul>
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

  li {
    display: table-row;

    &.activo {
      .conteoObras {
        color: white;
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

    // Usamos sombra para no tener que usar "bold" ya que este hace que se partan las lineas. No es una solución perfecta pero mejor que calcular anchos para usar bold.
    &:hover {
      text-shadow: -0.5px 0px 0px #000000;
    }
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
    background-color: transparent;
    padding: 0.4em;
    margin-left: 0.7em;
    border-radius: 6px;
  }
}

#contenedorGrilla {
  display: flex;
  justify-content: flex-start;
}

#grilla {
  border-top: #788989d2 dashed 1px;
  display: flex;
  height: 100%;
  position: absolute;
  left: 200px;
  font-size: 0.7em;
  overflow: visible;
  color: #788989d2;

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
  top: -0.6em;
  width: 190px;
  text-align: right;
  font-size: 0.8em;
  color: #788989d2;
}
</style>
