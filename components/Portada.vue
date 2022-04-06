<template>
  <div id="portada">
    <Logo class="svgClaro" />
    <h1 class="titulo logo-texto claridad">{{ general.nombre }}</h1>
    <h2 class="subtitulo">{{ general.descripcion }}</h2>
  </div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';
import { urlImagen } from '../utilidades/ayudas';
export default {
  data() {
    return {
      informacion: {},
      urlImagenFondo: '',
    };
  },
  computed: {
    general() {
      return this.$store.state.general.datos;
    },
  },
  async fetch() {
    const query = gql`
      query {
        general {
          banner {
            id
            title
          }
        }
      }
    `;
    const general = await this.$graphql.principal.request(query);
    if (general) {
      this.informacion = general;
      this.urlImagenFondo = urlImagen(general.banner);
      console.log(general);
    }
  },
  methods: {
    urlImagen(objImg, key) {
      return objImg && objImg.id ? urlImagen(objImg.id, key) : '';
    },
  },
};
</script>

<style lang="scss" scoped>
@use 'sass:color';
#portada {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 99vh;
  width: 100%;
  z-index: 1;
  background-attachment: fixed;
  background-image: url(./static/imgs/background-image.png);
  background-repeat: no-repeat;
  background-size: cover;
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
