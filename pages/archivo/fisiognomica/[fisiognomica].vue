<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosFisiognomica = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'fisiognomica';

  const Fisiognomica = gql`
  query {
    fisiognomicas(filter: { slug: { _eq: "${ruta.params.fisiognomica}" } }, limit: 1) {
    nombre
  }
  }
  `;
  const { fisiognomicas } = await obtenerDatos(Fisiognomica);

  datosFisiognomica.value = fisiognomicas[0];
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosFisiognomica">
    <h1>{{ datosFisiognomica.nombre }}</h1>
  </div>
</template>
