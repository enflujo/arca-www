<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosFisiognomicaImagen = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'fisiognomicaImagen';

  const FisiognomicaImagen = gql`
  query {
    fisiognomicas_imagen(filter: { slug: { _eq: "${ruta.params.fisiognomicaImagen}" } }, limit: 1) {
    nombre
  }
  }
  `;
  const { fisiognomicas_imagen } = await obtenerDatos(FisiognomicaImagen);

  datosFisiognomicaImagen.value = fisiognomicas_imagen[0];
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosFisiognomicaImagen">
    <h1>{{ datosFisiognomicaImagen.nombre }}</h1>
  </div>
</template>
