<template>
  <div>
    <template v-if="$fetchState.pending">
      <h1>Pendiente...</h1>
    </template>

    <template v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </template>

    <template v-else>
      <div class="archivo">
        <h1>{{ pagina.titulo }}</h1>
        <p>{{ pagina.descripcion }}</p>

        <div class="descripcion">
          <div>
            <Buscador />
            <Filtros paises="paises" filtro="filtro" />
          </div>
          <div class="parte-inferior">
            <div class="imagenes-triangulares">
              <img
                v-for="(obra, i) in obras"
                :key="`obra-${i}`"
                :src="urlImagen(obras[i].image)"
                :alt="obras.title"
                width="190"
                id="arca-mascara"
              />
            </div>
          </div>
          <!-- <nuxt-img src="imgs/4408.jpg" sizes="sm:50vw md:250vw lg:200px" />
          <nuxt-img src="imgs/4408.jpg" sizes="sm:50vw md:250vw lg:200px" />
          <nuxt-img src="imgs/4408.jpg" sizes="sm:50vw md:250vw lg:200px" />
          <nuxt-img src="imgs/4408.jpg" sizes="sm:50vw md:250vw lg:200px" />
          <nuxt-img src="imgs/4408.jpg" sizes="sm:50vw md:250vw lg:200px" />
          <nuxt-img src="imgs/4408.jpg" sizes="sm:50vw md:250vw lg:200px" />
        --></div>
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
      obras: [],
    };
  },

  async fetch() {
    const query = gql`
      query {
        paginas(filter: { slug: { _eq: "archivo" } }, limit: 1) {
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

    const { paginas, artworks } = await this.$graphql.principal.request(query);

    if (paginas.length && paginas[0].slug) {
      this.pagina = paginas[0];
    } else {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error('La página no existe');
    }

    if (artworks && artworks.length) {
      this.obras = artworks;
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
    urlImagen(objImg, key) {
      return objImg && objImg.id ? urlImagen(objImg.id, key) : '';
    },
  },

  computed: {
    obrasSeleccionadas() {
      //  console.log(this.$store.state.buscador.seleccionados);
      return this.$store.state.buscador.seleccionados;
    },
  },

  watch: {
    obrasSeleccionadas(obras) {
      this.obras = obras;
    },
  },
};
</script>

<style lang="scss" scoped>
.archivo {
  margin: 3em;
  max-width: 90%;
}

.descripcion {
  padding-top: 1em;
}
.parte-inferior {
  position: absolute;
  top: 50vh;
  .arca-mascara {
    clip-path: url(#Path_405);
  }
}
</style>
