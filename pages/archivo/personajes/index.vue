<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos, ordenarPorNombre } from '~~/utilidades/ayudas';

const cargando = ref(true);
const personajes = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true }),
  onMounted(async () => {
    cerebroArchivo.paginaActual = 'personajes';

    const ObrasPorPersonajes = gql`
      query {
        personajes {
          nombre
          slug
          obras_func {
            count
          }
        }
      }
    `;

    const { personajes: datosPersonajes } = await obtenerDatos(ObrasPorPersonajes);
    ordenarPorNombre(datosPersonajes);
    personajes.value = datosPersonajes;

    cargando.value = false;
  });
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Personajes</h1>
  <p v-for="personaje in personajes" :key="personaje.slug">{{ personaje.nombre }} ({{ personaje.obras_func.count }})</p>
</template>
