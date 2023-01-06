<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosPais = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'paises';

  const Pais = gql`
  query {
    paises(filter: { slug: { _eq: "${ruta.params.pais}" } }, limit: 1) {
      nombre
    }
  }
  `;
  const { paises } = await obtenerDatos(Pais);

  datosPais.value = paises[0];
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosPais">
    <h1>{{ datosPais.nombre }}</h1>
  </div>
</template>
