<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const gestos = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true }),
  onMounted(async () => {
    cerebroArchivo.paginaActual = 'gestos';

    const ObrasPorGestos = gql`
      query {
        gestos(sort: ["nombre"], limit: -1) {
          nombre
          slug
          obras_func {
            count
          }
        }
      }
    `;

    const { gestos: datosGestos } = await obtenerDatos(ObrasPorGestos);
    gestos.value = datosGestos;
    cargando.value = false;
  });
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Gestos</h1>
  <ul class="opciones">
    <li v-for="gesto in gestos" :key="gesto.slug">
      <NuxtLink :to="`/archivo/gestos/${gesto.slug}?page=1`"
        >{{ gesto.nombre }} ({{ gesto.obras_func.count }})</NuxtLink
      >
    </li>
  </ul>
</template>
