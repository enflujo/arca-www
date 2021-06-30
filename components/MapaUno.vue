<template>
  <div class="contenedor-general">
    <div class="contenedor-derecho">
      <nuxt-img src="imgs/MapaImagen.jpeg" class="mapaImagen" />
    </div>
    <div class="contenedor-izquierdo">
      <div class="contenedor-mitad">
        <h1>{{ pagina.titulo }}</h1>
        <p>{{ pagina.descripcion }}</p>
      </div>
    </div>
    <Mapa :datos="obras" />
  </div>
</template>

<script>
// import mapboxgl from 'mapbox-gl';

export default {
  props: {
    pagina: {
      type: Object,
      default: () => {},
    },
    obras: {
      type: Array,
      default: () => [],
    },
  },

  // methods: {
  //   cambiarEstado() {
  //   },
  // },
};
</script>

<style lang="scss" scoped>
#mapa {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  display: block;
  position: absolute;
  clip-path: inset(32% 65% 10% 15% round 400px);
}

.mapboxgl-popup {
  position: absolute;
  max-width: 400px;
  font: 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif;
}

.contenedor-general {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  .contenedor-derecho {
    position: absolute;
    width: 50vw;
    left: 50vw;
    height: 100vh;
    .mapaImagen {
      right: 0px;
      height: 100vh;
    }
  }
  .contenedor-izquierdo {
    position: absolute;
    top: 0;
    left: 0;
    width: 50vw;
    height: 100vh;
    background-color: $profundidad;
    .contenedor-mitad {
      color: $claridad;
      position: relative;
      top: 100px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }
  }
}

.azul {
  color: $profundidad !important;
}

.transparencia {
  opacity: 0.4;
  display: block;
  top: 0px;
  position: absolute;
}
</style>
