<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos, ordenarPorNombre } from '~~/utilidades/ayudas';

const cargando = ref(true);
const fisiognomica = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true }),
  onMounted(async () => {
    cerebroArchivo.paginaActual = 'fisiognomica';

    const ObrasPorFisiognomica = gql`
      query {
        fisiognomicas {
          nombre
          slug
          obras_func {
            count
          }
        }
      }
    `;

    const { fisiognomicas: datosFisiognomica } = await obtenerDatos(ObrasPorFisiognomica);
    ordenarPorNombre(datosFisiognomica);
    fisiognomica.value = datosFisiognomica;

    cargando.value = false;
  });
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Fisiognómica</h1>
  <p v-for="elemento in fisiognomica" :key="elemento.slug">{{ elemento.nombre }} ({{ elemento.obras_func.count }})</p>
</template>
