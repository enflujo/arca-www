<script setup lang="ts">
import { usarGeneral } from '~/cerebros/general';

const cerebro = usarGeneral();
const menuVisible = ref(false);

if (!cerebro.datosCargados) {
  await useAsyncData('general', cerebro.cargarGeneral);
}

if (!cerebro.relaciones.length) {
  await useAsyncData('general', cerebro.cargarRelaciones);
}

function abrirOCerrar(evento: MouseEvent) {
  evento.stopPropagation();
  menuVisible.value = !menuVisible.value;
}

function cerrar() {
  menuVisible.value = false;
}
</script>

<template>
  <Encabezado />

  <div id="contenedor">
    <div class="botonMenu" @click="abrirOCerrar" :class="menuVisible ? 'cerrar' : 'abrir'">
      <span class="linea linea1"></span>
      <span class="linea linea2"></span>
      <span class="linea linea3"></span>
    </div>

    <MenuArchivo id="contenedorMenu" :visible="menuVisible" :cerrar="cerrar" />

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
  background-color: rgba($color: $verdeEsmeralda, $alpha: 0.92);
  position: fixed;
  overflow: auto;
  width: 0;
  height: 100vh;
  left: 0;
  z-index: 9;

  &.visible {
    width: 100vw;
  }
}

main {
  padding: 1em 1em 2em 5em;
  max-width: 1600px;
  margin: 0 auto;
}

#contenido {
  min-height: 86vh;
  width: 100vw;
  position: relative;
}

.botonMenu {
  height: 2.2rem;
  position: fixed;
  top: 4.5em;
  left: 0.5em;
  padding: 0.5rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border-radius: 0.25em;
  cursor: pointer;
  z-index: 10;

  .linea {
    background-color: $profundidad;
    border-radius: 1em;
    width: 2.16rem;
    height: 0.25rem;
  }

  .linea1 {
    transform-origin: 0% 0%;
    transition: transform 100ms ease-in-out;
  }

  .linea3 {
    transform-origin: 0% 100%;
    transition: transform 100ms ease-in-out;
  }

  &.cerrar {
    top: 4em;
    left: 85vw;
    .linea {
      background-color: $claridad;
    }

    .linea1 {
      display: block;
      transform: rotate(45deg);
    }

    .linea2 {
      opacity: 0;
    }

    .linea3 {
      display: block;
      transform: rotate(-45deg);
    }
  }
}

// Pantallas medianas (Tablets)
@media (min-width: $minTablet) {
  #contenedorMenu {
    &.visible {
      width: 380px;
    }
  }

  .botonMenu {
    &.cerrar {
      left: 300px;
    }
  }
}

// Dispositivos grandes y pantallas medianas
@media (min-width: $minPantalla) {
}

// Pantallas grandes - Ahora si el menú y el contenido son visibles al tiempo.
@media (min-width: $minPantallaGrande) {
  #contenedorMenu {
    width: 380px;
    background-color: $verdeEsmeralda;
  }

  #contenido {
    width: calc(100vw - 380px);
  }

  .botonMenu {
    display: none;
  }

  main {
    padding: 2em 5em 2em 3em;
  }
}

//Pantallas gigantes
@media (min-width: $minPantallaGigante) {
}
</style>
