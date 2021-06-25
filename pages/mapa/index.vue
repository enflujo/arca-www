<template>
  <div>
    <template v-if="$fetchState.pending">
      <div class="contenedor">
        <div class="centrar-contenido">
          <h1>Pendiente...</h1>
        </div>
      </div>
    </template>

    <template v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </template>

    <template v-else>
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
      </div>
      <Mapa :datos="obras" />
    </template>
  </div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';
import { crearHead } from '../../utilidades/ayudas';

export default {
  layout: 'mapa',
  data() {
    return {
      pagina: {},
      obras: [],
    };
  },

  async fetch() {
    const query = gql`
      query {
        paginas(filter: { slug: { _eq: "mapa" } }, limit: 1) {
          titulo
          slug
          descripcion
          contenido
          banner {
            id
            title
          }
        }

        artworks {
          id
          title
          annotation_date
          latitude_current
          longitude_current
        }
      }
    `;

    const { paginas, artworks } = await this.$graphql.principal.request(query);

    if (paginas.length && paginas[0].slug) {
      this.pagina = paginas[0];
    } else {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error('La página no existe');
    }

    if (artworks && artworks.length) {
      this.obras = artworks;
    }
  },

  head() {
    return crearHead(
      this.$store.state.general.datos.nombre,
      this.pagina.titulo,
      this.pagina.descripcion,
      this.pagina.banner,
      this.$nuxt.$route.path
    );
  },
};
</script>

<style lang="scss" scoped>
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

.transparencia {
  opacity: 0.4;
  display: block;
  top: 0px;
  position: absolute;
}
</style>
