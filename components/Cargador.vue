<template>
  <div id="contenedor-cargador">
    <div class="cargador">
      <Logo class="logo" />
      <div class="texto-cargador">
        <span class="letra-cargador">A</span>
        <span class="letra-cargador">R</span>
        <span class="letra-cargador">C</span>
        <span class="letra-cargador">A</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ElementoCargador',
};
</script>

<style lang="scss" scoped>
@use 'sass:math';

.cargador {
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  position: fixed;
}

.logo {
  fill: $dolor;
}

.texto-cargador {
  text-align: center;

  .letra-cargador {
    display: inline-block;
    margin: 0 5px;
    color: $dolor;
    font-size: 32px;
    font-family: $fuentePrincipal;
    @for $i from 0 through 6 {
      &:nth-child(#{$i + 1}) {
        filter: blur(0px);
        animation: blur-text 1.5s (#{math.div($i, 5)}) + s infinite linear alternate;
      }
    }
  }
}

@keyframes blur-text {
  0% {
    filter: blur(0px);
  }
  100% {
    filter: blur(4px);
  }
}
</style>
