<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const caracteristicas = ref([]);
const cerebroArchivo = usarArchivo();

cerebroArchivo.paginaActual = 'Características Particulares';

const ObrasPorCaracteristicas = gql`
  query {
    caracteristicas(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { data, pending } = obtenerDatosAsinc('obrasPorCaracteristicas', ObrasPorCaracteristicas);

watch(data, ({ caracteristicas: datosCaracteristicas }) => {
  caracteristicas.value = datosCaracteristicas;
});

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Características Particulares</h1>
  <Cargador v-if="pending" />
  <!--<ul v-else>
    <li v-for="caracteristica in caracteristicas" :key="caracteristica.slug">
      <NuxtLink :to="`/archivo/caracteristicas-particulares/${caracteristica.slug}`"
        >{{ caracteristica.nombre }} ({{ caracteristica.obras_func.count }})</NuxtLink
      >
    </li>
  </ul>
-->
  <GraficaColombinas v-else :datos="caracteristicas" coleccion="caracteristicas-particulares" />
</template>
