<template>
  <div class="pagina autor">
    <Cargador v-if="$fetchState.pending" />

    <div v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </div>

    <div v-else class="contenido">
      <EtiquetasGaleria :busqueda="descriptor" />
      <Galeria :obras="obras" />
    </div>

    <Paginas v-if="totalObras > 100" :total="totalObras" :ruta="`/archivo/descriptor/${descriptorId}`" />
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
      descriptor: '',
      descriptorId: 0,
    };
  },

  async fetch() {
    const idDescriptor = (this.descriptorId = this.$route.params.id);
    const { page } = this.$route.query;

    const query = gql`
      query {
        obra_descriptores_lista_aggregated(filter: {
          descriptores_lista_id: {
            id: {
              _eq: ${idDescriptor}
            }
          }
        }) {
          count {
            id
          }
        }

        obra_descriptores_lista(filter: {
          descriptores_lista_id: {
            id: {
              _eq: ${idDescriptor}
            }
          }
        }, page: ${page}) {
          obra_id {
            arca_id
            titulo
            fechas_actividad
            imagen {
              id
            }
            autor {
              apellido
              nombre
            }
            ubicacion_actual {
            nombre
            lat
            lon
          }
          }
          descriptores_lista_id {
            descripcion
          }
        }
      }
    `;

    // eslint-disable-next-line camelcase
    const {
      obra_descriptores_lista_aggregated: obraDescriptoresListaAggregated,
      obra_descriptores_lista: obraDescriptoresLista,
    } = await this.$graphql.principal.request(query);

    // eslint-disable-next-line camelcase
    if (obraDescriptoresListaAggregated && obraDescriptoresListaAggregated.length) {
      this.totalObras = obraDescriptoresListaAggregated[0].count.id;
      console.log(this.totalObras);
    }

    // eslint-disable-next-line camelcase
    if (obraDescriptoresLista && obraDescriptoresLista.length) {
      // eslint-disable-next-line camelcase
      for (const obra in obraDescriptoresLista) {
        this.obras.push(obraDescriptoresLista[obra].obra_id);
      }
      this.descriptor = obraDescriptoresLista[0].descriptores_lista_id.descripcion;
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

<style lang="scss" scoped></style>
