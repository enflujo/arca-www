<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const fisiognomicaImagen = ref([]);
const cerebroArchivo = usarArchivo();

cerebroArchivo.paginaActual = 'Fisiognómica Imagen';

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

const { fisiognomicas_imagen: datosFisiognomicaImagen } = await obtenerDatos(
  'obrasPorFisiognomicaImagen',
  ObrasPorFisiognomicaImagen
);
fisiognomicaImagen.value = datosFisiognomicaImagen;

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Fisiognómica Imagen</h1>
  <GraficaColombinas :datos="fisiognomicaImagen" coleccion="fisiognomica-imagen" />
</template>
