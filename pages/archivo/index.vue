<script setup>
// import { crearHead, urlImagen } from '../../utilidades/ayudas';
const pagina = ref({});
const obras = ref([]);

// Nuxt normaliza los nombres de "layouts" a kebab-case.
definePageMeta({ layout: 'con-buscador' });

const { data, pending, error } = await useAsyncGql('ArchivoInicio', {}, { lazy: true });

watch(data, ({ paginas }) => {
  console.log(paginas);
  pagina.value = paginas[0];
});

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
  <Cargador v-if="pending" />
  <MenuVistas />
</template>

<style lang="scss" scoped></style>
