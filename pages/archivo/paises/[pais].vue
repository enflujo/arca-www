<script setup>
import { usarArchivo } from '~~/cerebros/archivo';

const datosPais = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(() => {
  cerebroArchivo.paginaActual = 'paises';
});

const { data, pending, error } = useAsyncGql('Pais', { slug: ruta.params.pais }, { lazy: true });

watch(data, ({ paises }) => {
  datosPais.value = paises[0];
});
</script>

<template>
  <Cargador v-if="pending" />
  <div v-if="datosPais">
    <h1>{{ datosPais.nombre }}</h1>
  </div>
</template>
