<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { obtenerDatos } from '~~/utilidades/ayudas';
import { buscarTermino } from '~~/utilidades/queries';

const cargando = ref(true);
const datosDonante = ref(null);
const obras = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'donantes';

  const Donante = buscarTermino('donantes', ruta.params.slug);
  const { donantes } = await obtenerDatos(Donante);

  datosDonante.value = donantes[0];
  obras.value = donantes[0].obras;
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosDonante">
    <h1>{{ datosDonante.nombre }}</h1>
    <Galeria :obras="obras" />
  </div>
</template>
