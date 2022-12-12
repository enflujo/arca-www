<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosEscenario = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'escenarios';

  const Escenario = gql`
  query {
    escenarios(filter: { slug: { _eq: "${ruta.params.escenario}" } }, limit: 1) {
    nombre
  }
  }
  `;
  const { escenarios } = await obtenerDatos(Escenario);

  datosEscenario.value = escenarios[0];
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosEscenario">
    <h1>{{ datosEscenario.nombre }}</h1>
  </div>
</template>
