<template>
  <div class="completo">
    <div class="division"></div>
  </div>
</template>

<script></script>

<style lang="scss">
@use "sass:color";

.completo {
  width: 100vw;
  height: 100vh;
  display: block;
  background-color: $profundidad;
  z-index: -1;
  .division {
    background-color: $claridad;
    width: 75%;
    height: 100vh;
    display: block;
    top: 0px;
    position: absolute;
    left: 0px;
  }
}
</style>
