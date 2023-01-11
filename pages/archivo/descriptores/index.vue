<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const descriptores = ref([]);
const cerebroArchivo = usarArchivo();

cerebroArchivo.paginaActual = 'Descriptores';

const ObrasPorDescriptores = gql`
  query {
    descriptores(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { data, pending } = obtenerDatosAsinc('obrasPorDescriptores', ObrasPorDescriptores);

watch(data, ({ descriptores: datosDescriptores }) => {
  descriptores.value = datosDescriptores;
});

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Descriptores</h1>
  <Cargador v-if="pending" />
  <ul v-else>
    <li v-for="descriptor in descriptores" :key="descriptor.slug">
      <NuxtLink :to="`/archivo/descriptores/${descriptor.slug}`"
        >{{ descriptor.nombre }} ({{ descriptor.obras_func.count }})</NuxtLink
      >
    </li>
  </ul>
</template>
