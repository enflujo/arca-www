<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos, ordenarPorNombre } from '~~/utilidades/ayudas';

const cargando = ref(true);
const fisiognomicaImagen = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true }),
  onMounted(async () => {
    cerebroArchivo.paginaActual = 'fisiognomicaImagen';

    const ObrasPorFisiognomicaImagen = gql`
      query {
        fisiognomicas_imagen {
          nombre
          slug
          obras_func {
            count
          }
        }
      }
    `;

    const { fisiognomicas_imagen: datosFisiognomicaImagen } = await obtenerDatos(ObrasPorFisiognomicaImagen);
    ordenarPorNombre(datosFisiognomicaImagen);
    fisiognomicaImagen.value = datosFisiognomicaImagen;

    cargando.value = false;
  });
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Fisiognómica Imagen</h1>
  <p v-for="elemento in fisiognomicaImagen" :key="elemento.slug">
    {{ elemento.nombre }} ({{ elemento.obras_func.count }})
  </p>
</template>
