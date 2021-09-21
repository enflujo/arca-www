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
        <DescripcionGaleria :numero="obras.length" :busqueda="$route.params.query" />
        <Galeria :obras="obras" />
        <MenuVistas :busqueda="$route.params.query" />
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
      obras: [],
    };
  },

  async fetch() {
    const queryString = this.$route.params.query;

    const query = gql`
      query {
        artworks(search: "${queryString}") {
            id
            title
            image {
              id
              title
            }
            author_id {
              id
              name
              lastname
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
  // TODO: arreglar los heads
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
