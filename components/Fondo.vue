<template>
  <div class="completo">
    <div class="division"></div>
  </div>
</template>

<script></script>

<style lang="scss">
@use "sass:color";

.completo {
  height: 100vh;
  display: block;
  background-color: $mediana;
  z-index: -1;
  .division {
    background-color: $claridad;
    width: 100vw;
    height: 50vh;
    display: block;
    top: 0px;
    position: absolute;
    left: 0px;
  }
}
</style>
