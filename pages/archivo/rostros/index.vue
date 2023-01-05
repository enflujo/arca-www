<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const rostros = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true }),
  onMounted(async () => {
    cerebroArchivo.paginaActual = 'rostros';

    const ObrasPorRostros = gql`
      query {
        rostros(sort: ["nombre"], limit: -1) {
          nombre
          slug
          obras_func {
            count
          }
        }
      }
    `;

    const { rostros: datosRostros } = await obtenerDatos(ObrasPorRostros);
    rostros.value = datosRostros;
    cargando.value = false;
  });
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Rostros</h1>
  <ul class="opciones">
    <li v-for="rostro in rostros" :key="rostro.slug">
      <NuxtLink :to="`/archivo/rostros/${rostro.slug}?page=1`"
        >{{ rostro.nombre }} ({{ rostro.obras_func.count }})</NuxtLink
      >
    </li>
  </ul>
</template>
