<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const relatos = ref([]);
const cerebroArchivo = usarArchivo();

cerebroArchivo.paginaActual = 'Relatos Visuales';

const ObrasPorRelatos = gql`
  query {
    relatos_visuales(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { relatos_visuales: datosRelatos } = await obtenerDatos('obrasPorRelatos', ObrasPorRelatos);
relatos.value = datosRelatos;

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Relatos Visuales</h1>

  <!--<ul class="opciones">
    <li v-for="relato in relatos" :key="relato.slug">
      <NuxtLink :to="`/archivo/relatos-visuales/${relato.slug}`"
        >{{ relato.nombre }} ({{ relato.obras_func.count }})</NuxtLink
      >
    </li>
  </ul>
  -->
  <GraficaColombinas :datos="relatos" coleccion="relatos" />
</template>
