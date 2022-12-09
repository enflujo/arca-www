<template>
  <div class="pagina autor">
    <Cargador v-if="$fetchState.pending" />

    <div v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </div>

    <div v-else class="contenido">
      <EtiquetasGaleria :busqueda="caracteristica" />
      <Galeria :obras="obras" />
    </div>

    <Paginas v-if="totalObras > 100" :total="totalObras" :ruta="`/archivo/caracteristica/${caracteristicaId}`" />
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
      caracteristica: '',
      caracteristicaId: 0,
    };
  },

  async fetch() {
    const idCaracteristica = (this.caracteristicaId = this.$route.params.id);
    const { page } = this.$route.query;

    const query = gql`
      query {
        obra_caracteristicas_particulares_lista_aggregated(filter: {
          caracteristicas_particulares_lista_id: {
            id: {
              _eq: ${idCaracteristica}
            }
          }
        }) {
          count {
            id
          }
        }

        obra_caracteristicas_particulares_lista(filter: {
          caracteristicas_particulares_lista_id: {
            id: {
              _eq: ${idCaracteristica}
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
          caracteristicas_particulares_lista_id {
            nombre
          }
        }
      }
    `;

    const {
      obra_caracteristicas_particulares_lista_aggregated: obraCaracteristicasParticularesListaAggregated,
      obra_caracteristicas_particulares_lista: obraCaracteristicasParticularesLista,
    } = await this.$graphql.principal.request(query);

    if (obraCaracteristicasParticularesListaAggregated && obraCaracteristicasParticularesListaAggregated.length) {
      this.totalObras = obraCaracteristicasParticularesListaAggregated[0].count.id;
    }

    if (obraCaracteristicasParticularesLista && obraCaracteristicasParticularesLista.length) {
      for (const obra in obraCaracteristicasParticularesLista) {
        this.obras.push(obraCaracteristicasParticularesLista[obra].obra_id);
      }
      this.caracteristica = obraCaracteristicasParticularesLista[0].caracteristicas_particulares_lista_id.nombre;
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
