<script setup>
const ruta = useRoute();
const obras = ref([]);
const pages = [...Array(11).keys()].splice(1);
const pais = ref('');
// import { crearHead } from '../../utilidades/ayudas';
definePageMeta({ layout: 'con-buscador' });

// export default {
//   async fetch() {
//     const pais = (this.pais = this.$route.params.pais);
//     const page = this.$route.query.page;

//     const query = gql`
//       query {
//         obra_aggregated(filter: { ubicacion_actual: { nombre: { _eq: "${pais}" } } } ) {
//           count {
//             id
//           }
//         }

//         obra(filter: { ubicacion_actual: { nombre: { _eq: "${pais}" } } }, page: ${page}) {
//           arca_id
//           titulo
//           autor {
//             apellido
//             nombre
//           }
//           fechas_actividad
//           sintesis
//           imagen {
//             id
//           }
//           ubicacion_actual {
//             nombre
//             ciudad {
//               pais {
//                 nombre_es
//               }
//             }
//             lat
//             lon
//           }
//         }
//       }
//     `;

//     // eslint-disable-next-line camelcase
//     const { obra, obra_aggregated } = await this.$graphql.principal.request(query);

//     // eslint-disable-next-line camelcase
//     if (obra_aggregated) {
//       const obrasPorPagina = 50;
//       const cantidadObras = Math.ceil(obra_aggregated[0].count.id / obrasPorPagina);
//       this.pages = Array.from({ length: cantidadObras }, (_, index) => index + 1);
//     }
//     if (obra && obra.length) {
//       this.obras = obra;
//     } else {
//       if (process.server) {
//         this.$nuxt.context.res.statusCode = 404;
//       }
//       throw new Error('La página no existe');
//     }
//   },

// watch: {
//   obrasSeleccionadas(obras) {
//     this.obras = obras;
//   },
// },
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
// };
</script>

<template>
  <div>
    <template v-if="$fetchState.pending">
      <Cargador />
    </template>

    <template v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </template>

    <template v-else>
      <div class="contenedor-pagina">
        <EtiquetasGaleria :busqueda="$route.params.pais" />
        <Galeria :obras="obras" />
        <MenuVistas :busqueda="$route.params.pais" />
      </div>
      <span class="paginas">
        <div v-if="obras.length == 100" class="pag-cont">
          <div v-for="(page, i) in pages" :key="`page-${i}`" class="num-pag" @click="$fetch">
            <nuxt-link :to="`/mapa/${pais}?page=${page}`"> {{ page }} </nuxt-link>
          </div>
        </div>
      </span>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.paginas {
  display: flex;
  width: 110vw;
  justify-self: center;
  align-self: center;
  margin: 10px;
  justify-content: center;
  position: absolute;
  bottom: 20px;
  .pag-cont {
    width: 350px;
    display: flex;
    border: 2px solid $profundidad;
    border-radius: 200px;
    justify-content: center;
    .num-pag {
      display: flex;
      justify-content: center;
      align-self: center;
      text-align: center;
      padding: 10px;
    }
  }
}
.error {
  margin-left: 8vw;
}
</style>
