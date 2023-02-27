<script setup>
import { usarGeneral } from '~~/cerebros/general';

const cerebro = usarGeneral();

if (!cerebro.datosCargados) {
  await useAsyncData('general', cerebro.cargarGeneral);
}
</script>

<template>
  <div id="contenedor">
    <MenuGeneral />
    <MenuBuscador id="contenedorBuscador" />
    <div id="contenido">
      <main role="main">
        <slot />
      </main>
      <Guardaescobas :completo="false" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
$margenMenu: 20vw;

#contenedor {
  color: var(--profundidad);
}

#contenedorBuscador {
  background-color: var(--verdeEsmeralda);
  position: fixed;
  overflow: auto;
  width: $margenMenu;
  height: 100vh;
}

main {
  background-color: var(--amarilloPetalo);
  padding: 2em 5em 2em 3em;
}

#contenido {
  margin-left: $margenMenu;
  min-height: 86vh;
}

// Pantallas medianas (Tablets)
@media (min-width: $minTablet) {
  #contenedorBuscador {
    max-width: 15vw;
  }
}

// Dispositivos grandes y pantallas medianas
@media (min-width: $minPantalla) {
  #contenedorBuscador {
    max-width: 400px;
  }
}

// Pantallas grandes
@media (min-width: $minPantallaGrande) {
  #contenedorBuscador {
    max-width: 20vw;
  }
}

//Pantallas gigantes
@media (min-width: $minPantallaGigante) {
  #contenedorBuscador {
    max-width: 400px;
  }

  main {
  }
}
</style>
