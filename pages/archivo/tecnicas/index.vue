<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const tecnicas = ref([]);
const cerebroArchivo = usarArchivo();

cerebroArchivo.paginaActual = 'Técnicas';

const ObrasPorTecnicas = gql`
  query {
    tecnicas(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { tecnicas: datosTecnicas } = await obtenerDatos('obrasPorTecnicas', ObrasPorTecnicas);
tecnicas.value = datosTecnicas;

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Técnicas</h1>
  <!--<ul class="opciones">
  <li v-for="tecnica in tecnicas" :key="tecnica.slug">
      <NuxtLink :to="`/archivo/tecnicas/${tecnica.slug}`"
        >{{ tecnica.nombre }} ({{ tecnica.obras_func.count }})</NuxtLink
      >
    </li>
  </ul>
  -->
  <GraficaColombinas :datos="tecnicas" coleccion="tecnicas" />
</template>
