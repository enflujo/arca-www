<script setup>
import { usarGeneral } from '~~/cerebros/general';

const cerebro = usarGeneral();

if (!cerebro.datosCargados) {
  await useAsyncData('general', cerebro.cargarGeneral);
}
</script>

<template>
  <Encabezado />

  <div id="contenedor">
    <MenuArchivo id="contenedorMenu" />

    <div id="contenido">
      <Buscador v-if="cerebro.buscadorVisible" />
      <main>
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
  margin-top: $altoEncabezado;
}

#contenedorMenu {
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
  position: relative;
}

// Pantallas medianas (Tablets)
@media (min-width: $minTablet) {
  #contenedorMenu {
    width: 60vw;
    max-width: 380px;
  }
}

// Dispositivos grandes y pantallas medianas
@media (min-width: $minPantalla) {
  #contenedorMenu {
    width: 40vw;
  }
}

// Pantallas grandes - Ahora si el menú y el contenido son visibles al tiempo.
@media (min-width: $minPantallaGrande) {
  #contenedorMenu {
    width: 30vw;
  }

  #contenido {
    width: 70vw;
    min-width: calc(100vw - 380px);
  }

  main {
    padding: 2em 1em 2em 2em;
  }
}

//Pantallas gigantes
@media (min-width: $minPantallaGigante) {
  #contenedorMenu {
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
