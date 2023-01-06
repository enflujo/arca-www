<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { obtenerDatos } from '~~/utilidades/ayudas';
import { buscarTermino } from '~~/utilidades/queries';

const cargando = ref(true);
const datosFisiognomica = ref(null);
const obras = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'fisiognomica';

  const Fisiognomica = buscarTermino('fisiognomicas', ruta.params.slug);
  const { fisiognomicas } = await obtenerDatos(Fisiognomica);

  datosFisiognomica.value = fisiognomicas[0];
  obras.value = fisiognomicas[0].obras;
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosFisiognomica">
    <h1>{{ datosFisiognomica.nombre }}</h1>
    <Galeria :obras="obras" />
  </div>
</template>
