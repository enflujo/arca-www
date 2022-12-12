<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosPersonaje = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'personajes';

  const Personaje = gql`
  query {
    personajes(filter: { slug: { _eq: "${ruta.params.personaje}" } }, limit: 1) {
    nombre
  }
  }
  `;
  const { personajes } = await obtenerDatos(Personaje);

  datosPersonaje.value = personajes[0];
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosPersonaje">
    <h1>{{ datosPersonaje.nombre }}</h1>
  </div>
</template>
