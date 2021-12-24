<template>
  <div>
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
      <div>
        <h1 class="error">{{ $fetchState.error.message }}</h1>
      </div>
    </template>

    <template v-else>
      <div class="contenedor-pagina">
        <DescripcionGaleria v-if="obras.length < 100" :numero="obras.length" :busqueda="$route.params.categoria" />
        <EtiquetasGaleria :busqueda="$route.params.categoria" />
        <Galeria :obras="obras" />
        <MenuVistas :busqueda="$route.params.categoria" />
      </div>
      <span class="paginas">
        <div v-if="obras.length == 100" class="pag-cont">
          <div v-for="(page, i) in pages" :key="`page-${i}`" class="num-pag" @click="$fetch">
            <nuxt-link :to="`/categoria/${categoria}?page=${page}`">
              {{ page }}
            </nuxt-link>
          </div>
        </div>
      </span>
    </template>
  </div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';
// import { crearHead, urlImagen } from '../../utilidades/ayudas';

export default {
  layout: 'conBuscador',
  data() {
    return {
      obras: [],
      pages: [...Array(11).keys()].splice(1),
      categoria: '',
    };
  },

  async fetch() {
    const categoria = (this.categoria = this.$route.params.categoria);
    const page = this.$route.query.page;

    const query = gql`
      query {
        artworks(filter: { _or: [
            {category_1_id: { name: { _eq: "${categoria}" } }},
            {category_2_id: { name: { _eq: "${categoria}" } }},
            {category_3_id: { name: { _eq: "${categoria}" } }},
            {category_4_id: { name: { _eq: "${categoria}" } }},
            {category_5_id: { name: { _eq: "${categoria}" } }},
        ] }, page: ${page}) {
          id
          title
          annotation_date
          synthesis
          latitude_current
          longitude_current
          actual_country_id {
            id
            name_spanish
          }
          origin_country_id {
            id
            name_spanish
          }
          author_id {
            id
            name
            lastname
            biography
          }
          image {
            id
            title
          }
          category_1_id {
            id
            name
          }
          category_2_id {
            id
            name
          }
          category_3_id {
            id
            name
          }
          category_4_id {
            id
            name
          }
          category_5_id {
            id
            name
          }
        }
      }
    `;

    const { artworks } = await this.$graphql.principal.request(query);

    if (artworks && artworks.length) {
      this.obras = artworks;
    } else {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error('La página no existe');
    }
  },

  /**
   * TODO: ver como construir el head con datos del pais.
   */
  // head() {
  //   return crearHead(
  //     this.$store.state.general.datos.nombre,
  //     this.pagina.titulo,
  //     this.pagina.descripcion,
  //     this.pagina.banner,
  //     this.$nuxt.$route.path
  //   );
  // },
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
.paginas {
  display: flex;
  width: 110vw;
  justify-self: center;
  align-self: center;
  margin: 10px;
  justify-content: center;
  position: relative;
  .pag-cont {
    width: 350px;
    display: flex;
    border: 2px solid $profundidad;
    border-radius: 200px;
    justify-content: center;
    .num-pag {
      display: flex;
      justify-content: center;
      align-self: center;
      text-align: center;
      padding: 10px;
    }
  }
}
</style>
