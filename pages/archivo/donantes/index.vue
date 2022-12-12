<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos, ordenarPorNombre } from '~~/utilidades/ayudas';

const cargando = ref(true);
const donantes = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'donantes';

  const ObrasPorDonantes = gql`
    query {
      donantes {
        nombre
        slug
        obras_func {
          count
        }
      }
    }
  `;

  const { donantes: datosDonantes } = await obtenerDatos(ObrasPorDonantes);
  ordenarPorNombre(datosDonantes);

  donantes.value = datosDonantes;

  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Donantes</h1>
  <p v-for="donante in donantes" :key="donante.slug">{{ donante.nombre }} ({{ donante.obras_func.count }})</p>
</template>
