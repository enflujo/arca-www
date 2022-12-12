<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

// import { crearHead, urlImagen } from '../../utilidades/ayudas';
const pagina = ref({});
const obras = ref([]);
const cargando = ref(true);
const cerebroArchivo = usarArchivo();

// Nuxt normaliza los nombres de "layouts" a kebab-case.
definePageMeta({ layout: 'con-buscador' });

onMounted(async () => {
  cerebroArchivo.paginaActual = '';

  const Archivo = gql`
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

  const { paginas } = await obtenerDatos(Archivo);
  pagina.value = paginas[0];
  cargando.value = false;
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
  <Cargador v-if="cargando" />
  <MenuVistas />

  <h1>{{ pagina.titulo }}</h1>
</template>

<style lang="scss" scoped></style>
