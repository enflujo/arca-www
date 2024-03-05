<template>
  <div class="contenedor-cargador">
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

<style lang="scss" scoped>
@use 'sass:math';

.cargador {
  transform: translate(-50%, -100%);
  left: 50%;
  top: 50%;
  position: absolute;
  text-align: center;
}

.logo {
  fill: var(--dolor);
  height: 60px;
}

.texto-cargador {
  text-align: center;
  color: var(--dolor);
  font-size: 20px;
  font-family: var(--fuentePrincipal);

  .letra-cargador {
    margin: 0 3px;

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
