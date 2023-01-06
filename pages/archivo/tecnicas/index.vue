<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const tecnicas = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true }),
  onMounted(async () => {
    cerebroArchivo.paginaActual = 'tecnicas';

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

    const { tecnicas: datosTecnicas } = await obtenerDatos(ObrasPorTecnicas);
    tecnicas.value = datosTecnicas;
    cargando.value = false;
  });
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Técnicas</h1>
  <ul class="opciones">
    <li v-for="tecnica in tecnicas" :key="tecnica.slug">
      <NuxtLink :to="`/archivo/tecnicas/${tecnica.slug}`"
        >{{ tecnica.nombre }} ({{ tecnica.obras_func.count }})</NuxtLink
      >
    </li>
  </ul>
</template>
