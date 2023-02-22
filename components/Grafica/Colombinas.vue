<script setup>
import { convertirEscala, escalaColores } from '@enflujo/alquimia';
import { obtenerVariablesCSS } from '~~/utilidades/ayudas';

const contenedor = ref(null);
const anchoPantalla = ref(0);
const datos = ref([]);
const maximoObras = ref(0);

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

onMounted(() => {
  /**
   * Ordenar por cantidad de obras en el país.
   */
  const datosOrdenados = props.datos.sort((a, b) => b.obras_func.count - a.obras_func.count);
  maximoObras.value = datosOrdenados[0].obras_func.count;
  datos.value = datosOrdenados;
  anchoPantalla.value = contenedor.value.clientWidth;
});
</script>

<template>
  <ul ref="contenedor">
    <li v-for="elemento in datos" :key="elemento.slug">
      <NuxtLink class="nombre fila" :to="`/archivo/${props.coleccion}/${elemento.slug}`">{{
        elemento.nombre
      }}</NuxtLink>

      <NuxtLink class="elementoColombina fila" :to="`/archivo/${props.coleccion}/${elemento.slug}`">
        <div class="colombina">
          <span
            class="lineaColombina"
            :style="`width:${convertirEscala(
              elemento.obras_func.count,
              1,
              maximoObras,
              0,
              anchoPantalla / 1.5
            )}px; background-color:${buscarColor(elemento.obras_func.count)}`"
          ></span>
          <span class="circuloColombina" :style="`background-color:${buscarColor(elemento.obras_func.count)}`"></span>
          <span class="conteoObras">{{ elemento.obras_func.count }}</span>
        </div>
      </NuxtLink>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
ul {
  display: table;
  width: 100%;

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
  }
}
.nombre {
  text-transform: uppercase;
  font-size: 0.8em;

  &:hover {
    font-weight: bold;
  }

  &:hover::before {
    content: '+ ';
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
    height: 7px;
    width: 7px;
    border-radius: 50%;
  }

  .conteoObras {
    color: #788989;
    font-size: 0.75em;
    padding-left: 0.4em;
  }
}
</style>
