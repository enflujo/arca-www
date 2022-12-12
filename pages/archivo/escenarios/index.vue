<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos, ordenarPorNombre } from '~~/utilidades/ayudas';

const cargando = ref(true);
const escenarios = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'escenarios';

  const ObrasPorEscenarios = gql`
    query {
      escenarios {
        nombre
        slug
        obras_func {
          count
        }
      }
    }
  `;

  const { escenarios: datosEscenarios } = await obtenerDatos(ObrasPorEscenarios);
  ordenarPorNombre(datosEscenarios);

  escenarios.value = datosEscenarios;

  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Escenarios</h1>
  <p v-for="escenario in escenarios" :key="escenario.slug">{{ escenario.nombre }} ({{ escenario.obras_func.count }})</p>
</template>
