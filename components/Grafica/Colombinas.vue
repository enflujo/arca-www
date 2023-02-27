<script setup>
import { convertirEscala, escalaColores } from '@enflujo/alquimia';
import { usarArchivo } from '~~/cerebros/archivo';
import { obtenerVariablesCSS } from '~~/utilidades/ayudas';

const contenedor = ref(null);
const anchoPantalla = ref(0);
const datosOrdenados = ref([]);
const maximoObras = ref(0);
const divisionesGrilla = [...Array(10).keys()];

const props = defineProps({
  datos: Array,
  coleccion: String,
});

const buscarColor = computed(() => {
  return escalaColores(
    1,
    maximoObras.value,
    obtenerVariablesCSS('--amarilloArena2'),
    obtenerVariablesCSS('--rojoCerezo')
  );
});
function anchoLinea(cantidad) {
  const ancho = convertirEscala(cantidad, 1, Math.ceil(maximoObras.value / 1000) * 1000, 0, anchoPantalla.value / 1.5);
  return ancho;
}

onMounted(() => {
  /**
   * Ordenar por cantidad de obras en el país.
   */
  const ordenados = props.datos.sort((a, b) => b.obras_func.count - a.obras_func.count);
  maximoObras.value = ordenados[0].obras_func.count;
  datosOrdenados.value = ordenados;
  anchoPantalla.value = contenedor.value.clientWidth;
});
</script>

<template>
  <div id="contenedorGrafica">
    <div id="contenedorGrilla">
      <div
        id="grilla"
        :style="`width:${convertirEscala(
          Math.ceil(maximoObras / 1000) * 1000,
          1,
          Math.ceil(maximoObras / 1000) * 1000,
          0,
          anchoPantalla / 1.5
        )}px`"
      >
        <span
          class="divisionGrilla"
          v-for="i in divisionesGrilla"
          :key="`división ${i}`"
          :style="`width:${
            convertirEscala(
              Math.ceil(maximoObras / 1000) * 1000,
              1,
              Math.ceil(maximoObras / 1000) * 1000,
              0,
              anchoPantalla / 1.5
            ) / 10
          }px`"
        >
          <p class="valorGrilla">
            {{ ((Math.ceil(maximoObras / 1000) * 1000) / 10) * i }}
          </p>
        </span>
      </div>
      <p id="leyendaEjeX">Cantidad de obras</p>
    </div>

    <ul ref="contenedor">
      <li v-for="elemento in datosOrdenados" :key="elemento.slug">
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
            <span class="conteoObras">{{ elemento.obras_func.count }}</span>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
#contenedorGrafica {
  position: relative;
}
ul {
  display: table;
  width: 100%;
  position: relative;
  margin-top: 2em;

  li {
    display: table-row;
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
  }
}
.nombre {
  text-transform: uppercase;
  font-size: 0.8em;

  &:hover {
    font-weight: bold;
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
    padding-left: 0.4em;
  }
}

#contenedorGrilla {
  display: flex;
  justify-content: flex-start;
}

#grilla {
  border-top: #78898955 dashed 1px;
  display: flex;
  height: 100%;
  position: absolute;
  left: 204px;
  font-size: 0.7em;
  overflow: visible;
  top: -1em;
  color: #78898955;

  .divisionGrilla {
    display: block;
    border-right: #78898955 solid 1px;
  }

  .valorGrilla {
    position: absolute;
    top: -2em;
  }
}
#leyendaEjeX {
  position: absolute;
  top: -0.7em;
  left: 157px;
  font-size: 0.8em;
  color: #78898955;
}
</style>
