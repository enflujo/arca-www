<script setup>
import { gql } from '~~/utilidades/ayudas';

const caracteristicas = ref([]);

const ObrasPorCaracteristicas = gql`
  query {
    caracteristicas(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { data, pending } = obtenerDatosAsinc('obrasPorCaracteristicas', ObrasPorCaracteristicas);

watch(data, ({ caracteristicas: datosCaracteristicas }) => {
  caracteristicas.value = datosCaracteristicas;
});

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Características Particulares</h1>
  <div id="filtros">
    <img
      class="filtro"
      :class="vista === 'lista' ? 'activo' : ''"
      src="~~/assets/imgs/boton_alfabetico.svg"
      @click="cambiarVista('lista')"
    />
    <img
      class="filtro"
      :class="vista === 'colombinas' ? 'activo' : ''"
      src="~~/assets/imgs/boton_colombinas.svg"
      @click="cambiarVista('colombinas')"
    />
  </div>
  <Cargador v-if="pending" />
  <GraficaColombinas v-else :datos="caracteristicas" coleccion="caracteristicas-particulares" />
</template>
