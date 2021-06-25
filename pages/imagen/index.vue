<template>
  <div>
    <template v-if="$fetchState.pending">
      <h1>Pendiente...</h1>
    </template>

    <template v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </template>

    <template v-else>
      <div class="sobre-arca">
        <h1>{{ pagina.titulo }}</h1>
        <p>{{ pagina.descripcion }}</p>
        <div class="descripcion">
          <nuxt-img src="imgs/4408.jpg" sizes="sm:100vw md:50vw lg:400px" />

          <p>Título. Artista. Año. Lugar</p>
          <p>{{ obras.title }}</p>
          <p>{{ id }}</p>
        </div>
      </div>
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
      obras: {},
      id: this.getId(),
    };
  },

  mounted() {
    this.getId();
  },

  async fetch() {
    const query = gql`
      query {
        paginas(filter: { slug: { _eq: "sobre-arca" } }, limit: 1) {
          titulo
          slug
          descripcion
          contenido
          banner {
            id
            title
          }
        }
        artworks(filter: { id: { _eq: ${this.id} } }) {
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

    if (artworks) {
      this.obras = artworks[0];
      // console.log(this.obras);
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

  methods: {
    getId() {
      return this.$route.query.id;
    },
  },
};
</script>

<style lang="scss" scoped></style>
