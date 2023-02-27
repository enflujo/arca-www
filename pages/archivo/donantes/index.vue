<script setup>
import { gql } from '~~/utilidades/ayudas';

const donantes = ref([]);

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

const { data, pending } = obtenerDatosAsinc('obrasPorDonantes', ObrasPorDonantes);

watch(data, ({ donantes: datosDonantes }) => {
  donantes.value = datosDonantes;
});

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Donantes</h1>
  <Cargador v-if="pending" />
  <GraficaColombinas v-else :datos="donantes" coleccion="donantes" />
</template>
