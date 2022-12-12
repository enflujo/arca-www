<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosRelato = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'relatos';

  const Relato = gql`
  query {
    relatos_visuales(filter: { slug: { _eq: "${ruta.params.relato}" } }, limit: 1) {
    nombre
  }
  }
  `;
  const { relatos } = await obtenerDatos(Relato);

  datosRelato.value = relatos[0];
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosRelato">
    <h1>{{ datosRelato.nombre }}</h1>
  </div>
</template>
