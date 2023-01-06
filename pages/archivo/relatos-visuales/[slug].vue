<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { obtenerDatos } from '~~/utilidades/ayudas';
import { buscarTermino } from '~~/utilidades/queries';

const cargando = ref(true);
const datosRelato = ref(null);
const obras = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'relatos';

  const Relato = buscarTermino('relatos_visuales', ruta.params.slug);
  const { relatos_visuales } = await obtenerDatos(Relato);

  datosRelato.value = relatos_visuales[0];
  obras.value = relatos_visuales[0].obras;
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosRelato">
    <h1>{{ datosRelato.nombre }}</h1>
    <Galeria :obras="obras" />
  </div>
</template>
