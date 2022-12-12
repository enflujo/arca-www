<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos, ordenarPorNombre } from '~~/utilidades/ayudas';

const cargando = ref(true);
const tecnicas = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true }),
  onMounted(async () => {
    cerebroArchivo.paginaActual = 'tecnicas';

    const ObrasPorTecnicas = gql`
      query {
        tecnicas {
          nombre
          slug
          obras_func {
            count
          }
        }
      }
    `;

    const { tecnicas: datosTecnicas } = await obtenerDatos(ObrasPorTecnicas);
    ordenarPorNombre(datosTecnicas);
    tecnicas.value = datosTecnicas;

    cargando.value = false;
  });
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Técnicas</h1>
  <p v-for="tecnica in tecnicas" :key="tecnica.slug">{{ tecnica.nombre }} ({{ tecnica.obras_func.count }})</p>
</template>
