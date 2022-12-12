<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosObjeto = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'objetos';

  const Objeto = gql`
  query {
    objetos(filter: { slug: { _eq: "${ruta.params.objeto}" } }, limit: 1) {
    nombre
  }
  }
  `;
  const { objetos } = await obtenerDatos(Objeto);

  datosObjeto.value = objetos[0];
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosObjeto">
    <h1>{{ datosObjeto.nombre }}</h1>
  </div>
</template>
