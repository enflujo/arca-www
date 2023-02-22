<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const donantes = ref([]);
const cerebroArchivo = usarArchivo();

cerebroArchivo.paginaActual = 'Donantes';

const ObrasPorDonantes = gql`
  query {
    donantes(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { data, pending } = obtenerDatosAsinc('obrasPorDonantes', ObrasPorDonantes);

watch(data, ({ donantes: datosDonantes }) => {
  donantes.value = datosDonantes;
});

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Donantes</h1>
  <Cargador v-if="pending" />
  <!--<ul v-else>
    <li v-for="donante in donantes" :key="donante.slug">
      <NuxtLink :to="`/archivo/donantes/${donante.slug}`"
        >{{ donante.nombre }} ({{ donante.obras_func.count }})</NuxtLink
      >
    </li>
  </ul>
-->
  <GraficaColombinas v-else :datos="donantes" coleccion="donantes" />
</template>
