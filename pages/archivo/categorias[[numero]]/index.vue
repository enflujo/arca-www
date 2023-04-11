<script setup>
// import { aplanarCategorias } from '~~/utilidades/ayudas';

import { gql } from '~/utilidades/ayudas';

// const categorias = ref([]);

// const camposCategoria = (nivel = 1, respuesta) => {
//   if (nivel === 1) {
//     const agregado = `query {
//         categorias${nivel}(limit: -1) {
//           id
//           nombre
//           slug
//           obras_func { count }
//           `;
//     return camposCategoria(nivel + 1, agregado);
//   }

//   if (nivel !== 1 && nivel <= 6) {
//     const agregado =
//       respuesta +
//       `
//         categorias${nivel}(limit: -1) {
//           id
//           nombre
//           slug
//           ancestro {
//             id
//           }
//           obras_func { count }
//           `;
//     return camposCategoria(nivel + 1, agregado);
//   } else {
//     return respuesta + '}}}}}}}';
//   }
// };

// const { data, pending } = obtenerDatosAsinc('categorias', camposCategoria());

// watch(data, ({ categorias1 }) => {
//   categorias.value = categorias1.map((categoria1) => {
//     return aplanarCategorias(categoria1, 2);
//   });
// });

const datos = ref([]);

const categorias1Query = gql`
  query {
    categorias1(sort: ["nombre"], limit: -1) {
      slug
      nombre
      descripcion
      imagen {
        id
        title
      }
      obras_func {
        count
      }
    }
  }
`;

const { data, pending } = obtenerDatosAsinc(`categorias1`, categorias1Query);

watch(data, ({ categorias1 }) => {
  datos.value = categorias1;
});

definePageMeta({ layout: 'archivo' });
</script>

<template>
  <h1>Categorías</h1>
  <Cargador v-if="pending" />

  <div v-else>
    <div v-for="categoria1 in datos" :key="`categoria1${categoria1.id}`">
      <h2>
        <NuxtLink :to="`/archivo/categorias1/${categoria1.slug}`"
          >{{ categoria1.nombre }} ({{ categoria1.obras_func.count }})</NuxtLink
        >
      </h2>
      <div v-html="categoria1.descripcion"></div>
    </div>
  </div>
  <!-- <GraficaArbol v-else :datos="categorias" /> -->
</template>

<style lang="scss" scoped>
ul {
  padding-left: 1em;
}
</style>
