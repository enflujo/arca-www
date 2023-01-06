<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosPais = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

cerebroArchivo.paginaActual = 'Ubicaciones';

const Pais = gql`
  query {
    paises(filter: { slug: { _eq: "${ruta.params.pais}" } }, limit: 1) {
      nombre
    }
  }
  `;
const { paises } = await obtenerDatos('pais', Pais);

datosPais.value = paises[0];
cargando.value = false;

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosPais">
    <h1>{{ datosPais.nombre }}</h1>
  </div>
</template>
