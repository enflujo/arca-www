<template>
  <div class="contenedor-elementos">
    <div class="linea-uno"></div>
    <div class="cruz"></div>
    <div class="linea-dos"></div>
  </div>
</template>

<script></script>

<style lang="scss">
@use "sass:color";

.contenedor-elementos {
  position: absolute;
  width: 100vw;
  height: 30vh;
  top: 10%;
  .linea-uno {
    background-color: $profundidad;
    width: 3px;
    height: 45%;
    top: 0;
    position: relative;
  }
  .cruz {
    display: flex;
  }
  .linea-dos {
    background-color: $profundidad;
    width: 3px;
  }
}
</style>
