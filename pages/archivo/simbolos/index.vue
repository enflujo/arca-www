<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const simbolos = ref([]);
const cerebroArchivo = usarArchivo();

cerebroArchivo.paginaActual = 'Símbolos';

const ObrasPorSimbolos = gql`
  query {
    simbolos(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { data, pending } = obtenerDatosAsinc('obrasPorSimbolos', ObrasPorSimbolos);

watch(data, ({ simbolos: datosSimbolos }) => {
  simbolos.value = datosSimbolos;
});

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Simbolos</h1>
  <Cargador v-if="pending" />
  <!--<ul v-else>
    <li v-for="simbolo in simbolos" :key="simbolo.slug">
      <NuxtLink :to="`/archivo/simbolos/${simbolo.slug}`"
        >{{ simbolo.nombre }} ({{ simbolo.obras_func.count }})</NuxtLink
      >
    </li>
  </ul>
-->
  <GraficaColombinas v-else :datos="simbolos" coleccion="simbolos" />
</template>
