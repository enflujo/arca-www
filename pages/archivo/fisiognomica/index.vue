<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const fisiognomica = ref([]);
const cerebroArchivo = usarArchivo();

cerebroArchivo.paginaActual = 'fisiognomica';

const ObrasPorFisiognomica = gql`
  query {
    fisiognomicas(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { fisiognomicas: datosFisiognomica } = await obtenerDatos('obrasPorFisiognomica', ObrasPorFisiognomica);
fisiognomica.value = datosFisiognomica;

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Fisiognómica</h1>
  <ul class="opciones">
    <li v-for="elemento in fisiognomica" :key="elemento.slug">
      <NuxtLink :to="`/archivo/fisiognomica/${elemento.slug}`"
        >{{ elemento.nombre }} ({{ elemento.obras_func.count }})</NuxtLink
      >
    </li>
  </ul>
</template>
