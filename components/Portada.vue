<template>
  <div id="portada">
    <Logo class="svgClaro" />
    <h1 class="titulo logo-texto claridad">{{ general.nombre }}</h1>
    <h2 class="subtitulo">{{ general.descripcion }}</h2>
  </div>
</template>

<script>
import { crearHead } from '../utilidades/ayudas';

export default {
  data() {
    return {
      estiloPortada: null,
      ctx: null,
      animReq: null,
    };
  },

  head() {
    return crearHead(this.general.nombre, null, this.general.descripcion, this.general.banner, this.$nuxt.$route.path);
  },

  computed: {
    general() {
      return this.$store.state.general.datos;
    },
  },
};
</script>

<style lang="scss" scoped>
@use "sass:color";
#portada {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 99vh;
  z-index: 1;
}

.logoArca {
  width: 100px;
  margin-top: 10px;
  display: block;
}

#logoArca {
  width: 125px;
  margin-top: 10px;
  display: block;
  position: relative;
  color: $claridad;
}

.titulo {
  font-size: 3em;
  margin: 0;
  z-index: 10;
}

.claridad {
  color: $claridad;
}

.logo-texto {
  letter-spacing: 1px;
  text-transform: uppercase;
}

.bg-img {
  display: block;
  width: 99vw;
  height: auto;
  top: 0;
  left: 0;
}

.svgClaro {
  fill: $claridad;
}

.subtitulo {
  font-size: 1.4em;
  color: $claridad;
  font-weight: 400;
  text-transform: uppercase;
  width: 400px;
  text-align: center;
  font-family: $fuenteMenu;
  letter-spacing: 5px;
  z-index: 10;
}
</style>
