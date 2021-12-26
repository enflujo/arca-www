<template>
  <div class="centrar-contenido">
    <template v-if="$fetchState.pending">
      <div class="loading-contenedor">
        <Logo class="svgDolor opac" />
        <div class="loading">
          <div class="loading-text">
            <span class="loading-text-words">A</span>
            <span class="loading-text-words">R</span>
            <span class="loading-text-words">C</span>
            <span class="loading-text-words">A</span>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </template>

    <template v-else>
      <h1>{{ pagina.titulo }}</h1>
      <p>{{ $route.path }}</p>
    </template>
  </div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';
import { crearHead } from '../../utilidades/ayudas';

export default {
  data() {
    return {
      pagina: {},
    };
  },

  async fetch() {
    const query = gql`
      query {
        paginas(filter: { slug: { _eq: "${this.$route.params.pagina}" } }, limit: 1) {
          titulo
          slug
          descripcion
          contenido
          banner {
            id
            title
          }
        }
      }
    `;

    const { paginas } = await this.$graphql.principal.request(query);

    if (paginas.length && paginas[0].slug) {
      this.pagina = paginas[0];
    } else {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error('La página no existe');
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
.loading-contenedor {
  width: calc(100vw - 280px);
  left: 280px;
  position: relative;
  padding-left: 500px;
  padding-right: 500px;
  padding-top: 250px;
  padding-bottom: 250px;
  height: calc(100vh - 120px);
}
.svgDolor {
  fill: $dolor;
}
// .opac {
//   animation: opacidad 2s infinite;
// }
// @keyframes opacidad {
//   0% {
//     opacity: 0;
//   }
//   50% {
//     opacity: 1;
//   }
//   100% {
//     opacity: 0;
//   }
// }
.loading-text {
  height: 100px;
  text-align: center;
  span {
    display: inline-block;
    margin: 0 5px;
    color: $dolor;
    font-size: 32px;
    font-family: $fuentePrincipal;
    @for $i from 0 through 6 {
      &:nth-child(#{$i + 1}) {
        filter: blur(0px);
        animation: blur-text 1.5s (#{$i/5}) + s infinite linear alternate;
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
