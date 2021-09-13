<template>
  <div id="portada">
    <Logo class="svgClaro" />
    <h1 class="titulo logo-texto claridad">{{ general.nombre }}</h1>
    <h2 class="subtitulo">{{ general.descripcion }}</h2>
  </div>
</template>

<script>
export default {
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
  width: 100vw;
  z-index: 1;
  background-attachment: fixed;
  background-image: url(./static/imgs/background-image.png);
  background-position: 50%, 50%;
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
