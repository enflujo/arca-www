<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';
import { buscarTermino } from '~~/utilidades/queries';

const cargando = ref(true);
const datosRostro = ref(null);
const obras = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'rostros';

  const Rostro = buscarTermino('rostros', ruta.params.slug);
  const { rostros } = await obtenerDatos(Rostro);

  datosRostro.value = rostros[0];
  obras.value = rostros[0].obras;
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosRostro">
    <h1>{{ datosRostro.nombre }}</h1>
    <Galeria :obras="obras" />
  </div>
</template>
