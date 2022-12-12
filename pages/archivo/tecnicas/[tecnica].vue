<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosTecnica = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'tecnicas';

  const Tecnica = gql`
  query {
    tecnicas(filter: { slug: { _eq: "${ruta.params.tecnica}" } }, limit: 1) {
    nombre
  }
  }
  `;
  const { tecnicas } = await obtenerDatos(Tecnica);

  datosTecnica.value = tecnicas[0];
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosTecnica">
    <h1>{{ datosTecnica.nombre }}</h1>
  </div>
</template>
