<script setup>
import { gql } from '~~/utilidades/ayudas';

const fisiognomicaImagen = ref([]);
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
