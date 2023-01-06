<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const personajes = ref([]);
const cerebroArchivo = usarArchivo();
cerebroArchivo.paginaActual = 'personajes';

const ObrasPorPersonajes = gql`
  query {
    personajes(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { personajes: datosPersonajes } = await obtenerDatos('obrasPorPersonaje', ObrasPorPersonajes);
personajes.value = datosPersonajes;

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Personajes</h1>
  <ul class="opciones">
    <li v-for="personaje in personajes" :key="personaje.slug">
      <NuxtLink :to="`/archivo/personajes/${personaje.slug}`">
        {{ personaje.nombre }} ({{ personaje.obras_func.count }})
      </NuxtLink>
    </li>
  </ul>
</template>
