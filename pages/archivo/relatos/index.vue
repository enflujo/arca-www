<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos, ordenarPorNombre } from '~~/utilidades/ayudas';

const cargando = ref(true);
const relatos = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'relatos';

  const ObrasPorRelatos = gql`
    query {
      relatos_visuales {
        nombre
        slug
        obras_func {
          count
        }
      }
    }
  `;

  const { relatos_visuales: datosRelatos } = await obtenerDatos(ObrasPorRelatos);

  ordenarPorNombre(datosRelatos);
  relatos.value = datosRelatos;

  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Relatos Visuales</h1>

  <ul class="opciones">
    <li v-for="relato in relatos" :key="relato.slug">
      <NuxtLink :to="`/archivo/relatos/${relato.slug}?page=1`"
        >{{ relato.nombre }} ({{ relato.obras_func.count }})</NuxtLink
      >
    </li>
  </ul>
</template>
