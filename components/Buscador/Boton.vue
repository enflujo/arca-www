<script setup lang="ts">
import { usarGeneral } from '~/cerebros/general';

const cerebroGeneral = usarGeneral();
const ruta = useRoute();

function abrirBuscador() {
  cerebroGeneral.buscadorVisible = true;
}

onMounted(async () => {
  if (ruta.query.buscar) {
    cerebroGeneral.busquedaActual = ruta.query.buscar as string;
    abrirBuscador();
  }
});
</script>

<template>
  <div id="botonBuscar" @click="abrirBuscador">
    <span class="indicacion">Buscar...</span>
    <img id="lupa" src="~/assets/imgs/lupa.svg" alt="Icono de lupa en buscador" />
  </div>
</template>

<style lang="scss" scoped>
#botonBuscar {
  width: 200px;
  height: 30px;
  border-radius: 20px;
  background-color: var(--verdeClaro2);
  position: relative;
  color: rgba($profundidad, 0.6);
  font-size: 0.9em;
  cursor: pointer;
  transition: opacity 0.25s ease-in-out;
  opacity: 0.85;
  margin-left: auto;
  margin-right: 1.5em;

  &:hover {
    opacity: 1;
  }
}

.indicacion {
  position: absolute;
  top: 0.5em;
  left: 1em;
}

#lupa {
  position: absolute;
  height: 15px;
  width: auto;
  right: 13px;
  top: 8px;
}
</style>
