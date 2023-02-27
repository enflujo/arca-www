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
#contenedor {
  color: var(--profundidad);
  display: flex;
  justify-content: flex-end;
}

#contenedorBuscador {
  background-color: var(--verdeEsmeralda);
  position: fixed;
  overflow: auto;
  width: 100vw;
  height: 100vh;
  left: 0;
  z-index: 9;
}

main {
  background-color: var(--amarilloPetalo);
}

#contenido {
  min-height: 86vh;
  width: 100vw;
  z-index: 1;
}

// Pantallas medianas (Tablets)
@media (min-width: $minTablet) {
  #contenedorBuscador {
    width: 60vw;
    max-width: 450px;
  }
}

// Dispositivos grandes y pantallas medianas
@media (min-width: $minPantalla) {
  #contenedorBuscador {
    width: 40vw;
  }
}

// Pantallas grandes - Ahora si el menú y el contenido son visibles al tiempo.
@media (min-width: $minPantallaGrande) {
  #contenedorBuscador {
    width: 30vw;
  }

  #contenido {
    width: 70vw;
    min-width: calc(100vw - 450px);
  }

  main {
    padding: 2em 1em 2em 1em;
  }
}

//Pantallas gigantes
@media (min-width: $minPantallaGigante) {
  #contenedorBuscador {
    width: 20vw;
  }

  #contenido {
    width: 80vw;
  }

  main {
    padding: 2em 5em 2em 3em;
  }
}
</style>
