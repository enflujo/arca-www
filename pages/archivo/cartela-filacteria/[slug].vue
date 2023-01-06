<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { obtenerDatos } from '~~/utilidades/ayudas';
import { buscarTermino } from '~~/utilidades/queries';

const cargando = ref(true);
const datosCartelaFilacteria = ref(null);
const obras = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'cartela-filacteria';

  const CartelaFilacteria = buscarTermino('cartelas_filacterias', ruta.params.slug);
  const { cartelas_filacterias } = await obtenerDatos(CartelaFilacteria);

  datosCartelaFilacteria.value = cartelas_filacterias[0];
  obras.value = cartelas_filacterias[0].obras;
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosCartelaFilacteria">
    <h1>{{ datosCartelaFilacteria.nombre }}</h1>
    <Galeria :obras="obras" />
  </div>
</template>
