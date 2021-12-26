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
        <!-- <h1 class="error">{{ $fetchState.error.message }}</h1> -->
        <h2 class="error">No hay regitros que coincidan con los criterios de búsqueda.</h2>
        <nuxt-link :to="`/archivo`"> Volver a buscar </nuxt-link>
      </div>
    </template>

    <template v-else>
      <div class="contenedor-pagina">
        <span class="paginas">
          <div v-for="(page, i) in pages" :key="`page-${i}`" @click="$fetch">
            <nuxt-link
              v-if="obras.length == 100"
              :to="`/filtros?autor=${autorSeleccionado}&pais=${paisSeleccionado}&categoria1=${categoriaSeleccionada}&page=${page}`"
            >
              {{ page }}
            </nuxt-link>
          </div>
        </span>
        <!-- <DescripcionGaleria :numero="obras.length" :busqueda="$route.query.autor" /> -->
        <EtiquetasGaleria :busqueda="$route.query.categoria1" />
        <Galeria :obras="obras" />
      </div>
    </template>
  </div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';
export default {
  layout: 'conBuscador',
  data() {
    return {
      pagina: {},
      obras: [],
      pages: [...Array(11).keys()].splice(1),
      categoriaSeleccionada: '',
      autorSeleccionado: '',
      paisSeleccionado: '',
    };
  },
  async fetch() {
    let autor = `"${this.$route.query.autor}"`;
    this.autorSeleccionado = this.$route.query.autor;
    let pais = `"${this.$route.query.pais}"`;
    this.paisSeleccionado = this.$route.query.pais;
    let categoria = `"${this.$route.query.categoria1}"`;
    this.categoriaSeleccionada = this.$route.query.categoria1;
    const page = this.$route.query.page;
    if (this.$route.query.autor === null) {
      autor = null;
      this.autorSeleccionado = '';
    }
    if (this.$route.query.pais === null) {
      pais = null;
      this.paisSeleccionado = '';
    }
    if (this.$route.query.categoria1 === null) {
      categoria = null;
      this.categoriaSeleccionada = '';
    }
    const query = gql`
      query {
        artworks(filter: { _and: [ { _or: [
            {category_1_id: { name: { _eq: ${categoria} } }},
            {category_2_id: { name: { _eq: ${categoria} } }},
            {category_3_id: { name: { _eq: ${categoria} } }},
            {category_4_id: { name: { _eq: ${categoria} } }},
            {category_5_id: { name: { _eq: ${categoria} } }},
        ] },
            {author_id: { lastname: { _eq: ${autor} } }},
            { _or: [
              {actual_country_id: { name_spanish: { _eq: ${pais} } }},
              {origin_country_id: { name_spanish: { _eq: ${pais} } }},
            ] }
        ]  }, page:  ${page}) {
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
  width: 100%;
  justify-self: center;
  align-self: center;
  margin: 10px;
  justify-content: center;
}
</style>
