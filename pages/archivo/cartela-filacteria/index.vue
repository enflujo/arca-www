<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const cartelaFilacteria = ref([]);
const cerebroArchivo = usarArchivo();

cerebroArchivo.paginaActual = 'Cartela - Filacteria';

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

const { data, error, pending } = obtenerDatosAsinc('obrasPorCartela', ObrasPorCartela);

watch(data, ({ cartelas_filacterias: datosCartelaFilacteria }) => {
  cartelaFilacteria.value = datosCartelaFilacteria;
});

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Cartela - Filacteria</h1>
  <Cargador v-if="pending" />
  <!--<ul v-else>
    <li v-for="elemento in cartelaFilacteria" :key="elemento.slug">
      <NuxtLink :to="`/archivo/cartela-filacteria/${elemento.slug}`">
        {{ elemento.nombre }} ({{ elemento.obras_func.count }})
      </NuxtLink>
    </li>
  </ul>
-->
  <GraficaColombinas v-else :datos="cartelaFilacteria" coleccion="cartela-filacteria" />
</template>
