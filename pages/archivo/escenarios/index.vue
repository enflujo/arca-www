<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const escenarios = ref([]);
const cerebroArchivo = usarArchivo();

cerebroArchivo.paginaActual = 'Escenarios';

const ObrasPorEscenarios = gql`
  query {
    escenarios(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { data, pending } = obtenerDatosAsinc('obrasPorEscenarios', ObrasPorEscenarios);

watch(data, ({ escenarios: datosEscenarios }) => {
  escenarios.value = datosEscenarios;
});

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Escenarios</h1>
  <Cargador v-if="pending" />
  <!--  <ul v-else>
    <li v-for="escenario in escenarios" :key="escenario.slug">
      <NuxtLink :to="`/archivo/escenarios/${escenario.slug}`"
        >{{ escenario.nombre }} ({{ escenario.obras_func.count }})</NuxtLink
      >
    </li>
  </ul>
S-->
  <GraficaColombinas v-else :datos="escenarios" coleccion="escenarios" />
</template>
