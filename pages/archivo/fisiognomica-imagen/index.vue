<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const fisiognomicaImagen = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true }),
  onMounted(async () => {
    cerebroArchivo.paginaActual = 'fisiognomica-imagen';

    const ObrasPorFisiognomicaImagen = gql`
      query {
        fisiognomicas_imagen(sort: ["nombre"], limit: -1) {
          nombre
          slug
          obras_func {
            count
          }
        }
      }
    `;

    const { fisiognomicas_imagen: datosFisiognomicaImagen } = await obtenerDatos(ObrasPorFisiognomicaImagen);
    fisiognomicaImagen.value = datosFisiognomicaImagen;

    cargando.value = false;
  });
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Fisiognómica Imagen</h1>
  <ul class="opciones">
    <li v-for="elemento in fisiognomicaImagen" :key="elemento.slug">
      <NuxtLink :to="`/archivo/fisiognomicaImagen/${elemento.slug}?page=1`"
        >{{ elemento.nombre }} ({{ elemento.obras_func.count }})</NuxtLink
      >
    </li>
  </ul>
</template>
