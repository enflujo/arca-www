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
        <h1>{{ obras.title }}</h1>
        <div class="descripcion">
          <img :src="urlImagen(obras.image)" :alt="obras.title" />

          <p>Autor: {{ `${obras.author_id.name} ${obras.author_id.lastname}` }}</p>
          <p>{{ obras.annotation_date }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';
import { crearHead, urlImagen } from '../../utilidades/ayudas';

export default {
  data() {
    return {
      pagina: {},
      obras: {},
      autor: {},
    };
  },

  async fetch() {
    const query = gql`
      query {
        paginas(filter: { slug: { _eq: "imagen" } }, limit: 1) {
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

    const { paginas, artworks, authors } = await this.$graphql.principal.request(query);

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
    if (authors) {
      this.autor = authors[0];
      // console.log(this.$route.query.title);
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

  computed: {
    id() {
      return this.$route.query.id;
    },
    authorId() {
      return this.$store.state.buscador.seleccionados.authorId;
    },
  },

  mounted() {},

  methods: {
    urlImagen(objImg, key) {
      return objImg && objImg.id ? urlImagen(objImg.id, key) : '';
    },
  },
};
</script>

<style lang="scss" scoped></style>
