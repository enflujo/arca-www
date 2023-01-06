<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const cartelaFilacteria = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true }),
  onMounted(async () => {
    cerebroArchivo.paginaActual = 'cartela-filacteria';

    const ObrasPorCartela = gql`
      query {
        cartelas_filacterias(sort: ["nombre"], limit: -1) {
          nombre
          slug
          obras_func {
            count
          }
        }
      }
    `;

    const { cartelas_filacterias: datosCartelaFilacteria } = await obtenerDatos(ObrasPorCartela);
    cartelaFilacteria.value = datosCartelaFilacteria;
    cargando.value = false;
  });
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Cartela - Filacteria</h1>
  <ul class="opciones">
    <li v-for="elemento in cartelaFilacteria" :key="elemento.slug">
      <NuxtLink :to="`/archivo/cartela-filacteria/${elemento.slug}`">
        {{ elemento.nombre }} ({{ elemento.obras_func.count }})
      </NuxtLink>
    </li>
  </ul>
</template>
