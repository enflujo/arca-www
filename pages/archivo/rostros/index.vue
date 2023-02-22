<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const rostros = ref([]);
const cerebroArchivo = usarArchivo();

cerebroArchivo.paginaActual = 'Rostros';

const ObrasPorRostros = gql`
  query {
    rostros(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { rostros: datosRostros } = await obtenerDatos('obrasPorRostros', ObrasPorRostros);
rostros.value = datosRostros;

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Rostros</h1>
  <!--<ul class="opciones">
    <li v-for="rostro in rostros" :key="rostro.slug">
      <NuxtLink :to="`/archivo/rostros/${rostro.slug}`">{{ rostro.nombre }} ({{ rostro.obras_func.count }})</NuxtLink>
    </li>
  </ul>
  -->
  <GraficaColombinas :datos="rostros" coleccion="rostros" />
</template>
