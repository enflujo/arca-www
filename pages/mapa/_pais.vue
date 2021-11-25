<template>
  <div>
    <template v-if="$fetchState.pending">
      <h1>Pendiente...</h1>
    </template>

    <template v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </template>

    <template v-else>
      <div class="contenedor-pagina">
        <DescripcionGaleria v-if="obras.length < 100" :numero="obras.length" :busqueda="$route.params.pais" />
        <EtiquetasGaleria :busqueda="$route.params.pais" />
        <Galeria :obras="obras" />
        <span class="paginas">
          <div v-if="obras.length == 100" class="pag-cont">
            <div v-for="(page, i) in pages" :key="`page-${i}`" class="num-pag" @click="$fetch">
              <nuxt-link :to="`/mapa/${pais}?page=${page}`"> {{ page }} </nuxt-link>
            </div>
          </div>
        </span>
      </div>
    </template>
  </div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';
// import { crearHead } from '../../utilidades/ayudas';

export default {
  layout: 'conBuscador',
  data() {
    return {
      obras: [],
      pages: [...Array(11).keys()].splice(1),
      pais: '',
    };
  },

  async fetch() {
    const pais = (this.pais = this.$route.params.pais);
    const page = this.$route.query.page;

    const query = gql`
      query {
        artworks(filter: { actual_country_id: { name_spanish: { _eq: "${pais}" } } }, page: ${page}) {
          id
          title
          annotation_date
          synthesis
          latitude_current
          longitude_current
          image {
            id
            title
          }
          author_id {
            id
            name
            lastname
          }
          actual_country_id {
            id
            name_spanish
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

  watch: {
    obrasSeleccionadas(obras) {
      this.obras = obras;
    },
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
.paginas {
  display: flex;
  width: 100%;
  justify-self: center;
  align-self: center;
  margin: 10px;
  justify-content: center;
  position: absolute;
  bottom: 20px;
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
