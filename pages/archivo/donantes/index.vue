<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const donantes = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'donantes';

  const ObrasPorDonantes = gql`
    query {
      donantes(sort: ["nombre"], limit: -1) {
        nombre
        slug
        obras_func {
          count
        }
      }
    }
  `;

  const { donantes: datosDonantes } = await obtenerDatos(ObrasPorDonantes);
  donantes.value = datosDonantes;

  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Donantes</h1>
  <ul class="opciones">
    <li v-for="donante in donantes" :key="donante.slug">
      <NuxtLink :to="`/archivo/donantes/${donante.slug}?page=1`"
        >{{ donante.nombre }} ({{ donante.obras_func.count }})</NuxtLink
      >
    </li>
  </ul>
</template>
