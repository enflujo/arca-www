<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos, ordenarPorNombre } from '~~/utilidades/ayudas';

const cargando = ref(true);
const cartelaFilacteria = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true }),
  onMounted(async () => {
    cerebroArchivo.paginaActual = 'cartelaFilacteria';

    const ObrasPorCartela = gql`
      query {
        cartelas_filacterias {
          nombre
          slug
          obras_func {
            count
          }
        }
      }
    `;

    const { cartelas_filacterias: datosCartelaFilacteria } = await obtenerDatos(ObrasPorCartela);
    ordenarPorNombre(datosCartelaFilacteria);
    cartelaFilacteria.value = datosCartelaFilacteria;

    cargando.value = false;
  });
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Cartela - Filacteria</h1>
  <p v-for="elemento in cartelaFilacteria" :key="elemento.slug">
    {{ elemento.nombre }} ({{ elemento.obras_func.count }})
  </p>
</template>
