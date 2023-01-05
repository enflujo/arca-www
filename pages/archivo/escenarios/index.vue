<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const escenarios = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'escenarios';

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

  const { escenarios: datosEscenarios } = await obtenerDatos(ObrasPorEscenarios);
  escenarios.value = datosEscenarios;

  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Escenarios</h1>
  <ul class="opciones">
    <li v-for="escenario in escenarios" :key="escenario.slug">
      <NuxtLink :to="`/archivo/escenarios/${escenario.slug}?page=1`"
        >{{ escenario.nombre }} ({{ escenario.obras_func.count }})</NuxtLink
      >
    </li>
  </ul>
</template>
