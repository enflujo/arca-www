<script setup>
import { crearHead, urlImagen } from '../../utilidades/ayudas';
const pagina = ref({});
const obras = ref([]);

// Nuxt normaliza los nombres de "layouts" a kebab-case.
definePageMeta({ layout: 'con-buscador' });

const { data, error } = await useAsyncGql('ArchivoInicio');

pagina.value = data.value.paginas[0];

// export default {
//   data() {
//     return {
//       pagina: {},
//       obras: [],
//     };
//   },

//   async fetch() {
//     const query = gql`
//       query {
//         paginas(filter: { slug: { _eq: "archivo" } }, limit: 1) {
//           titulo
//           slug
//           descripcion
//           contenido
//           banner {
//             id
//             title
//           }
//         }
//       }
//     `;

//     const { paginas } = await this.$graphql.principal.request(query);

//     if (paginas.length && paginas[0].slug) {
//       this.pagina = paginas[0];
//     } else {
//       if (process.server) {
//         this.$nuxt.context.res.statusCode = 404;
//       }
//       throw new Error('La página no existe');
//     }
//   },

//   head() {
//     return crearHead(
//       this.$store.state.general.datos.nombre,
//       this.pagina.titulo,
//       this.pagina.descripcion,
//       this.pagina.banner,
//       this.$nuxt.$route.path
//     );
//   },

//   computed: {
//     obrasSeleccionadas() {
//       return this.$store.state.buscador.seleccionados;
//     },

//     busquedaActual() {
//       return this.$store.state.buscador.busquedaActual;
//     },
//   },

//   watch: {
//     obrasSeleccionadas(obras) {
//       this.obras = obras;
//     },
//   },

//   methods: {
//     urlImagen(objImg, key) {
//       return objImg && objImg.id ? urlImagen(objImg.id, key) : '';
//     },
//   },
// };
</script>

<template>
  <div id="archivo" class="pagina">
    <!-- <Cargador v-if="$fetchState.pending" /> -->

    <!-- <div v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </div> -->

    <section class="contenido">
      <MenuVistas />
      <NuxtLink class="enlace-archivo" to="/archivo/paises">Lugares</NuxtLink>
    </section>
  </div>
</template>

<style lang="scss" scoped>
//TODO: Esto es temporal mientras se diseña un home del archivo
.enlace-archivo {
  margin: 1em;
  font-size: 1.3em;
  font-weight: bold;
  color: $dolor;

  &:hover {
    color: lighten($dolor, 20%);
  }
}
</style>
