<template>
  <div id="inicio">
    <Background />
    <section id="portada" ref="seccionPortada" :style="estiloPortada">
      <Logo class="svgClaro" />
      <h1 class="titulo logo-texto claridad">{{ general.nombre }}</h1>
      <h2 class="subtitulo">{{ general.descripcion }}</h2>
      <canvas ref="lienzo" class="lienzo"></canvas>
    </section>
  </div>
</template>

<script>
import { urlImagen, crearHead } from '../utilidades/ayudas';

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

  beforeMount() {
    window.addEventListener('resize', this.actualizar);
    //
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.actualizar);
    window.cancelAnimationFrame(this.animReq);
  },

  mounted() {
    if (!this.ctx) {
      this.crearContexto();
    }
    this.actualizar();
    this.animReq = requestAnimationFrame(this.animar);
  },

  methods: {
    actualizar() {
      const { lienzo, seccionPortada } = this.$refs;
      const ctx = this.ctx;
      const dims = seccionPortada.getBoundingClientRect();
      lienzo.width = dims.width;
      lienzo.height = dims.height;
      ctx.globalAlpha = 0.5;
    },

    animar() {
      // TODO: animar un dondo liquido
      // this.animReq = requestAnimationFrame(this.animar.bind(this));
    },

    crearEstiloPortada() {
      const urlImgPortada = urlImagen(this.general.public_background.id, {
        fit: 'inside',
        width: 1200,
        quality: 60,
      });

      this.estiloPortada = `background-image:url(${urlImgPortada})`;
    },

    crearContexto() {
      this.ctx = this.$refs.lienzo.getContext('2d');
      this.actualizar();
    },
  },
};
</script>

<style lang="scss" scoped>
section {
  min-height: 50vh;
  position: relative;
  z-index: 1;
}

#portada {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.lienzo {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  vertical-align: top;
  pointer-events: none;
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
  width: 100vw;
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
}

// Teléfonos horizontal
@media (min-width: $minCelular) {
}

// Pantallas medianas (Tablets)
@media (min-width: $minTablet) {
}

// Dispositivos grandes y pantallas medianas
@media (min-width: $minPantalla) {
}

// Pantallas grandes
@media (min-width: $minPantallaGrande) {
}
</style>
