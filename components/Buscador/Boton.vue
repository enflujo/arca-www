<script setup>
import { usarGeneral } from '~~/cerebros/general';

const cerebroGeneral = usarGeneral();
function abrirBuscador() {
  cerebroGeneral.buscadorVisible = true;
}
</script>

<template>
  <div id="botonBuscar" @click="abrirBuscador">
    <span>Buscar...</span>
    <img id="lupa" src="~~/assets/imgs/lupa.svg" alt="Icono de lupa en buscador" />
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
  padding: 0.5em 0 0 1em;
  cursor: pointer;
  transition: opacity 0.25s ease-in-out;
  opacity: 0.85;

  &:hover {
    opacity: 1;
  }
}

#lupa {
  position: absolute;
  height: 15px;
  width: auto;
  right: 10px;
  top: 7px;
}
</style>
