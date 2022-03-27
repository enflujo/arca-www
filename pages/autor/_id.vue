<template>
  <div class="pagina autor">
    <Cargador v-if="$fetchState.pending" />

    <div v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </div>

    <div v-else class="contenido">
      <EtiquetasGaleria :busqueda="autor" />
      <Galeria :obras="obras" />
    </div>

    <Paginas v-if="totalObras > 100" :total="totalObras" :ruta="`/autor/${autorId}`" />
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
      totalObras: 0,
      autor: '',
      autorId: null,
    };
  },

  async fetch() {
    const idAutor = this.$route.params.id;
    const { page } = this.$route.query;

    const query = gql`
      query {
        obra_aggregated(filter: {
          autor: {
            id: {
              _eq: ${idAutor}
            }
          }
        }) {
          count {
            id
          }
        }

        obra(filter: { autor: { id: { _eq: ${idAutor} } } }, page: ${page} ) {
          arca_id
          titulo
          fechas_actividad
          sintesis
          ubicacion_actual {
            nombre
            lat
            lon
          }
          imagen {
            id
          }
          autor {
            apellido
            nombre
            biografia
          }
        }
      }
    `;

    // eslint-disable-next-line camelcase
    const { obra, obra_aggregated } = await this.$graphql.principal.request(query);

    // eslint-disable-next-line camelcase
    if (obra_aggregated) {
      this.totalObras = obra_aggregated[0].count.id;
    }

    if (obra && obra.length) {
      this.obras = obra;
      this.autorId = idAutor;
      const { nombre, apellido } = obra[0].autor;
      this.autor = nombre ? `${nombre} ${apellido}` : apellido;
    } else {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error('La página no existe');
    }
  },

  watch: {
    '$route.query': '$fetch',
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
.error {
  margin-left: 8vw;
}
</style>
