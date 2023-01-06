<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { obtenerDatos } from '~~/utilidades/ayudas';
import { buscarTermino } from '~~/utilidades/queries';

const cargando = ref(true);
const datosGesto = ref(null);
const obras = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'gestos';

  const Gesto = buscarTermino('gestos', ruta.params.slug, true);
  const { gestos } = await obtenerDatos(Gesto);
  datosGesto.value = gestos[0];
  /* Cuando las obras vienen de una tabla relacional muchos-a-muchos, hay que procesarlas para que el código
del componente Galería funcione.*/
  obras.value = gestos[0].obras.map((obra) => obra.obras_id);
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosGesto">
    <h1>{{ datosGesto.nombre }}</h1>
    <Galeria :obras="obras" />
  </div>
</template>
