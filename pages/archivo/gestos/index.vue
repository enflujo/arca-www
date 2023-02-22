<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const gestos = ref([]);
const cerebroArchivo = usarArchivo();

cerebroArchivo.paginaActual = 'Gestos';

const ObrasPorGestos = gql`
  query {
    gestos(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { gestos: datosGestos } = await obtenerDatos('obrasPorGestos', ObrasPorGestos);
gestos.value = datosGestos;

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Gestos</h1>
  <!--<ul class="opciones">
    <li v-for="gesto in gestos" :key="gesto.slug">
      <NuxtLink :to="`/archivo/gestos/${gesto.slug}`">{{ gesto.nombre }} ({{ gesto.obras_func.count }})</NuxtLink>
    </li>
  </ul>
-->
  <GraficaColombinas :datos="gestos" coleccion="gestos" />
</template>
