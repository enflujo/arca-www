<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';
import { buscarTermino } from '~~/utilidades/queries';

const cargando = ref(true);
const datosTecnica = ref(null);
const obras = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'tecnicas';

  const Tecnica = buscarTermino('tecnicas', ruta.params.slug, true);
  const { tecnicas } = await obtenerDatos(Tecnica);

  datosTecnica.value = tecnicas[0];
  /* Cuando las obras vienen de una tabla relacional muchos-a-muchos, hay que procesarlas para que el código
  del componente Galería funcione.*/
  obras.value = tecnicas[0].obras.map((obra) => obra.obras_id);
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosTecnica">
    <h1>{{ datosTecnica.nombre }}</h1>
    <Galeria :obras="obras" />
  </div>
</template>
