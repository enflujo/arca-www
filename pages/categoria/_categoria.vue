<template>
  <div>
    <template v-if="$fetchState.pending">
      <div>
        <h1>Pendiente...</h1>
      </div>
    </template>

    <template v-else-if="$fetchState.error">
      <div>
        <h1 class="error">{{ $fetchState.error.message }}</h1>
      </div>
    </template>

    <template v-else>
      <div class="contenedor-pagina">
        <DescripcionGaleria :numero="obras.length" :busqueda="$route.params.categoria" />
        <!-- <EtiquetasGaleria /> -->
        <Galeria :obras="obras" />
        <MenuVistas :busqueda="$route.params.categoria" />
      </div>
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
    };
  },

  async fetch() {
    const categoria = this.$route.params.categoria;

    const query = gql`

      query {
        artworks(filter: { _or: [
            {category_1_id: { name: { _eq: "${categoria}" } }},
            {category_2_id: { name: { _eq: "${categoria}" } }},
            {category_3_id: { name: { _eq: "${categoria}" } }},
            {category_4_id: { name: { _eq: "${categoria}" } }},
            {category_5_id: { name: { _eq: "${categoria}" } }},
        ] }, limit: -1) {
          id
          title
          annotation_date
          synthesis
          latitude_current
          longitude_current
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

<style lang="scss" scoped></style>
