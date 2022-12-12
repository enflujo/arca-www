<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosGesto = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'gestos';

  const Gesto = gql`
  query {
    gestos(filter: { slug: { _eq: "${ruta.params.gesto}" } }, limit: 1) {
    nombre
  }
  }
  `;
  const { gestos } = await obtenerDatos(Gesto);
  datosGesto.value = gestos[0];
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosGesto">
    <h1>{{ datosGesto.nombre }}</h1>
  </div>
</template>
