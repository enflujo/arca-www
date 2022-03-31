<template>
  <div class="pagina autor">
    <Cargador v-if="$fetchState.pending" />

    <div v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </div>

    <div v-else class="contenido">
      <EtiquetasGaleria :busqueda="simbolo" />
      <Galeria :obras="obras" />
    </div>

    <Paginas v-if="totalObras > 100" :total="totalObras" :ruta="`/archivo/simbolo/${simboloId}`" />
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
      simbolo: '',
      simboloId: null,
    };
  },

  async fetch() {
    const idSimbolo = this.$route.params.id;
    // const { page } = this.$route.query;

    const query = gql`
      query {
        obra_aggregated(filter: {
          simbolo: {
            id: {
              _eq: ${idSimbolo}
            }
          }
        }) {
          count {
            arca_id
          }
        }

        obra_simbolos_lista(filter: {
          simbolos_lista_id: {
            id: {
              _eq: ${idSimbolo}
            }
          }
        }) {
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
          simbolos_lista_id {
            nombre
          }
        }
      }
    `;

    // eslint-disable-next-line camelcase
    const { obra_aggregated, obra_simbolos_lista } = await this.$graphql.principal.request(query);

    // eslint-disable-next-line camelcase
    if (obra_aggregated) {
      this.totalObras = obra_aggregated[0].count.id;
    }

    // eslint-disable-next-line camelcase
    if (obra_simbolos_lista && obra_simbolos_lista.length) {
      // eslint-disable-next-line camelcase
      for (const obra in obra_simbolos_lista) {
        this.obras.push(obra_simbolos_lista[obra].obra_id);
      }
      this.simbolo = obra_simbolos_lista[0].simbolos_lista_id.nombre;
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
