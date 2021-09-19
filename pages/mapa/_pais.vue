<template>
  <div>
    <template v-if="$fetchState.pending">
      <h1>Pendiente...</h1>
    </template>

    <template v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </template>

    <template v-else>
      <h4>Hay {{ obras.length }} obras de {{ this.obras[0].actual_country_id.name_spanish }} en la colección.</h4>
      <div v-for="obra in obras" :key="`obra-${obra.id}`">{{ obra.title }}</div>
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

    const res = await this.$graphql.principal.request(query);

    if (res.artworks && res.artworks.length) {
      this.obras = res.artworks;
    } else {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error('La página no existe');
    }
  },
<<<<<<< HEAD

  watch: {
    obrasSeleccionadas(obras) {
      this.obras = obras;
    },
  },
=======
>>>>>>> 17ce0be (🚀 Primer borrador usando buscador como modulo en paginas)
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
