<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { obtenerDatos } from '~~/utilidades/ayudas';
import { buscarTermino } from '~~/utilidades/queries';

const cargando = ref(true);
const datosFisiognomicaImagen = ref(null);
const obras = ref([]);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'fisiognomica-imagen';
  const FisiognomicaImagen = buscarTermino('fisiognomicas_imagen', ruta.params.slug);
  const { fisiognomicas_imagen } = await obtenerDatos(FisiognomicaImagen);

  datosFisiognomicaImagen.value = fisiognomicas_imagen[0];
  obras.value = fisiognomicas_imagen[0].obras;
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosFisiognomicaImagen">
    <h1>{{ datosFisiognomicaImagen.nombre }}</h1>
    <Galeria :obras="obras" />
  </div>
</template>
