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
        <DescripcionGaleria :numero="obras.length" :busqueda="$route.params.pais" />
        <EtiquetasGaleria />
        <Galeria :obras="obras" />
        <MenuVistas :busqueda="$route.params.pais" />
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
    };
  },

  async fetch() {
    const pais = this.$route.params.pais;

    const query = gql`
      query {
        artworks(filter: { actual_country_id: { name_spanish: { _eq: "${pais}" } } }, limit: -1) {
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
