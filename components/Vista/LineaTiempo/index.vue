<script setup>
import { convertirEscala } from '@enflujo/alquimia';

const props = defineProps({
  datos: Object,
  fechaInicial: Number,
  fechaFinal: Number,
  max: Number,
  coleccion: String,
});

const contenedor = ref(null);
const informacion = ref(null);
const infoConteo = ref(0);
const infoAño = ref(0);
const infoMostrar = ref(false);
const desde = ref(props.fechaInicial);
const hasta = ref(Math.ceil(props.fechaFinal / 10) * 10);
const dimsVis = reactive({
  alto: 300,
  ancho: 400,
  altoVis: 0,
  marcoIz: 30,
  marcoAbajo: 20,
  margenIz: 10,
  margenArriba: 15,
  base: 0,
  inicioX: 0,
});
dimsVis.altoVis = dimsVis.alto - dimsVis.marcoAbajo;
dimsVis.base = dimsVis.alto - dimsVis.marcoAbajo;
dimsVis.inicioX = dimsVis.marcoIz + dimsVis.margenIz;

const seccionDatos = computed(() => props.datos.filter((obj) => obj.fecha >= desde.value && obj.fecha <= hasta.value));
const valorMax = computed(() => seccionDatos.value.reduce((a, b) => (a.cantidad > b.cantidad ? a : b)).cantidad);
const pasoX = ref(20);
const pasoY = computed(() => Math.pow(10, Math.floor(Math.log10(valorMax.value))));
const cielo = ref(Math.ceil(valorMax.value / pasoY.value) * pasoY.value);

const ejeX = (valor) => convertirEscala(valor, desde.value, hasta.value, dimsVis.inicioX, dimsVis.anchoVis);
const ejeY = (valor) => convertirEscala(valor, 0, valorMax.value, dimsVis.base - 5, dimsVis.margenArriba);
const anchoX = (valor) => convertirEscala(valor, 0, hasta.value - desde.value, 0, dimsVis.anchoVis);

const distancia = computed(() => props.fechaFinal - props.fechaInicial);
const partesX = computed(() => Math.ceil(distancia.value / pasoX.value) + 1);

onMounted(() => {
  dimsVis.ancho = contenedor.value.clientWidth;
  dimsVis.anchoVis = dimsVis.ancho - dimsVis.inicioX;
});

function controlDesdeDeslizador(evento) {
  const desdeValor = +evento.target.value;

  if (desdeValor < hasta.value && desdeValor > props.fechaInicial) {
    desde.value = desdeValor;
  } else {
    evento.target.value = desde.value;
  }
}

function controlHastaDeslizador(evento) {
  const hastaValor = +evento.target.value;

  if (hastaValor > desde.value && hastaValor < props.fechaFinal) {
    hasta.value = hastaValor;
  } else {
    evento.target.value = hasta.value;
  }
}

function mostrarInfo(d) {
  infoConteo.value = d.cantidad;
  infoAño.value = d.fecha;
  infoMostrar.value = true;
}

function apagarInfo() {
  infoMostrar.value = false;
}
</script>

<template>
  <div id="contenedorGrafica" ref="contenedor">
    <div
      id="informacion"
      v-if="infoMostrar"
      ref="informacion"
      :style="`transform:translate(${ejeX(infoAño)}px, ${ejeY(infoConteo)}px)`"
    >
      <p class="año"><span class="tituloInfo">año:</span> {{ infoAño }}</p>
      <p class="cantidad"><span class="tituloInfo">#obras:</span> {{ infoConteo }}</p>
    </div>

    <svg width="100%" :height="dimsVis.alto" v-if="dimsVis.anchoVis" @mouseleave="apagarInfo">
      <clipPath id="areaVis">
        <rect :x="dimsVis.inicioX" y="0" :width="dimsVis.anchoVis" :height="dimsVis.altoVis" />
      </clipPath>
      <!-- MARCO -->
      <line
        class="lineaMarco"
        :x1="dimsVis.inicioX"
        y1="0"
        :x2="dimsVis.inicioX"
        :y2="dimsVis.base"
        shape-rendering="crispEdges"
      />
      <line
        class="lineaMarco"
        :x1="dimsVis.marcoIz - 10"
        :y1="dimsVis.base"
        x2="100%"
        :y2="dimsVis.base"
        shape-rendering="crispEdges"
      />

      <!-- Marcas EjeX -->
      <g class="referenciaX">
        <g
          v-for="i in partesX"
          :key="`marcax-${i}`"
          :style="`transform:translateX(${ejeX(fechaInicial + (i - 1) * pasoX)}px)`"
        >
          <line class="marcaMarco" x1="0" :y1="dimsVis.base" x2="0" :y2="dimsVis.base + 7" />
          <text class="textoEjeX textoEje" x="0" :y="dimsVis.alto - 5" shape-rendering="crispEdges">
            {{ fechaInicial + (i - 1) * pasoX }}
          </text>
        </g>
      </g>

      <!-- Marcas EjeY -->
      <g class="referenciaY">
        <g v-for="i in 10" :key="`marcay-${i}`" :style="`transform:translateY(${ejeY((i - 1) * pasoY)}px)`">
          <line class="marcaMarco" :x1="dimsVis.inicioX - 7" y1="0" :x2="dimsVis.inicioX" y2="0" />
          <line class="referencia" :x1="dimsVis.inicioX" y1="0" x2="100%" y2="0" />
          <text class="textoEjeY textoEje" :x="dimsVis.inicioX - 10" y="0" shape-rendering="crispEdges">
            {{ (i - 1) * pasoY }}
          </text>
        </g>
      </g>

      <g v-for="(d, i) in datos" :key="`areaSensible${i}`" :style="`transform:translate(${ejeX(d.fecha)}px)`">
        <rect
          class="areaSensible"
          x="0"
          y="0"
          :width="i < d.length - 1 ? `${anchoX(d[i + 1].fecha - d.fecha)}px` : `${anchoX(pasoX)}`"
          :height="dimsVis.altoVis"
          @mouseenter="mostrarInfo(d)"
        />
      </g>

      <VistaLinea
        id="vis"
        :ejeX="ejeX"
        :ejeY="ejeY"
        :datos="datos"
        color="#9e171f"
        anchoLinea="0.5"
        radioPuntos="1"
        clip-path="url(#areaVis)"
      />
    </svg>

    <div class="contenedorRango">
      <div
        class="controlDeslizadores"
        :style="`width:${dimsVis.ancho - dimsVis.inicioX}px; transform:translateX(${dimsVis.inicioX}px)`"
      >
        <div class="lado ladoIzq" :style="`width:${((desde - fechaInicial) / distancia) * 100}%`"></div>
        <input
          id="desdeDeslizador"
          @input.stop.prevent="controlDesdeDeslizador"
          type="range"
          :value="desde"
          :min="fechaInicial"
          :max="fechaFinal"
        />

        <div class="lado ladoDer" :style="`width:${((fechaFinal - hasta) / distancia) * 99}%`"></div>
        <input
          id="hastaDeslizador"
          @input.stop.prevent="controlHastaDeslizador"
          type="range"
          :value="hasta"
          :min="fechaInicial"
          :max="fechaFinal"
        />
      </div>

      <div class="controlLinea">
        <div class="contenedorControlLinea">
          <input
            id="desdeEntrada"
            class="controlLineaTiempoEntrada"
            type="number"
            @change.stop.prevent="controlDesdeDeslizador"
            :value="desde"
            :min="fechaInicial"
            :max="fechaFinal"
          />
        </div>

        <div class="contenedorControlLinea">
          <input
            id="hastaEntrada"
            class="controlLineaTiempoEntrada"
            type="number"
            @change.stop.prevent="controlHastaDeslizador"
            :value="hasta"
            :min="fechaInicial"
            :max="fechaFinal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$altoLinea: 5px;

@mixin estiloBotonDeslizador {
  pointer-events: all;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--rojoCerezo);
  box-shadow: 0 0 0 1px var(--amarilloArena2);
  cursor: pointer;
}

svg {
  .lineaMarco {
    stroke: $profundidad;
    stroke-width: 1.2;
    opacity: 0.7;
  }

  .marcaMarco {
    stroke: $profundidad;
    stroke-width: 1;
  }

  .textoEje {
    font-size: 0.55em;
  }

  .textoEjeX {
    text-anchor: middle;
  }

  .textoEjeY {
    transform: translateY(0.3em);
    text-anchor: end;
  }

  .referencia {
    stroke-width: 0.5;
    stroke: rgb(186, 186, 186);
    stroke-dasharray: 2;
  }

  .areaSensible {
    fill: transparent;
  }
}

#informacion {
  position: absolute;
  // transform: translateY(120%);
  font-size: 0.65em;
  background-color: $rojoCerezo;
  color: white;
  padding: 0.5em;
  margin-top: -50px;

  .tituloInfo {
    font-weight: bold;
  }

  &::after {
    content: '';
    height: 20px;
    width: 0.5px;
    background-color: $rojoCerezo;
    position: absolute;
    left: 0;
  }
}

#contenedorGrafica {
  position: relative;
  width: 100%;
  margin: 0 auto;
}

#vis {
  position: relative;
  height: 300px;
}

.grupo {
  position: absolute;
  bottom: 0;
  height: 100%;
  width: 2px;
}
.punto {
  width: 2px;
  height: 2px;
  background-color: black;
  position: absolute;

  &.fuera {
    background-color: rgb(221, 219, 219);
  }
}
.lado {
  position: absolute;
  height: $altoLinea;
  display: block;
  background-color: rgba(white, 0.6);
  z-index: 1;
  top: 0;
}

.ladoIzq {
  left: 0;
}

.ladoDer {
  right: 0;
}
.contenedorRango {
  display: flex;
  flex-direction: column;
}

.controlDeslizadores {
  position: relative;
  margin-bottom: 1em;
}

.controlLinea {
  display: flex;
  justify-content: space-between;
  font-size: 24px;
  color: var(--amarilloArena2);
  padding-top: 1em;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  @include estiloBotonDeslizador;

  &:hover {
    background: #f7f7f7;
  }

  &:active {
    box-shadow: inset 0 0 3px #387bbe, 0 0 9px #387bbe;
  }
}

input[type='range']::-moz-range-thumb {
  -moz-appearance: none;
  @include estiloBotonDeslizador;

  &:hover {
    background: #f7f7f7;
  }

  &:active {
    box-shadow: inset 0 0 3px #387bbe, 0 0 9px #387bbe;
  }
}

input[type='number'] {
  color: var(--rojoRaspon);
  width: 60px;
  height: 30px;
  font-size: 0.6em;
  border: none;
  background-color: transparent;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  opacity: 1;
}

input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  pointer-events: none;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  position: absolute;
  height: $altoLinea;
}

#desdeDeslizador {
  z-index: 1;
  background-color: transparent;
}

#hastaDeslizador {
  background-color: var(--amarilloArena2);
}
</style>
