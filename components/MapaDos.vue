<template>
  <div class="contenedor-general">
    <!-- <div class="contenedor-derecho">
      <nuxt-img src="imgs/MapaImagen.jpeg" class="mapaImagen" />
    </div>
    <div class="contenedor-izquierdo">
      <div class="contenedor-mitad"></div>
    </div> -->
    <Mapa :datos="obras" />
    <div class="barra-derecha">
      <div class="lista-paises">
        <h2 class="nombre-pais">Pais 1</h2>
        <h2 class="nombre-pais">Pais 2</h2>
        <h2 class="nombre-pais">Pais 3</h2>
        <h2 class="nombre-pais">Pais 4</h2>
        <h2 class="nombre-pais">Pais 5</h2>
        <h2 class="nombre-pais">Pais 6</h2>
        <h2 class="nombre-pais">Pais 7</h2>
        <h2 class="nombre-pais">Pais 8</h2>
        <h2 class="nombre-pais">Pais 9</h2>
      </div>
    </div>
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
  z-index: -1;
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
  .barra-derecha {
    background-color: $profundidad;
    width: 25%;
    height: 100vh;
    z-index: 4;
    display: block;
    left: calc(100% - 25%);
    position: relative;
  }
  // .contenedor-derecho {
  //   position: absolute;
  //   width: 50vw;
  //   left: 50vw;
  //   height: 100vh;
  //   .mapaImagen {
  //     right: 0px;
  //     height: 100vh;
  //   }
  // }
  // .contenedor-izquierdo {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 50vw;
  //   height: 100vh;
  //   background-color: $profundidad;
  //   .contenedor-mitad {
  //     color: $claridad;
  //     position: relative;
  //     top: 100px;
  //     display: flex;
  //     justify-content: center;
  //     flex-direction: column;
  //     align-items: center;
  //   }
  // }
  .lista-paises {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    top: 100px;
    position: relative;
  }

  .nombre-pais {
    margin: 20px;
  }
}

.transparencia {
  opacity: 0.4;
  display: block;
  top: 0px;
  position: absolute;
}
</style>
