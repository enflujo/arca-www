<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const cargando = ref(true);
const total = ref(0);
const cerebroArchivo = usarArchivo();

cerebroArchivo.paginaActual = 'obras';

const Obras = gql`
  query {
    obras_aggregated {
      count {
        id
      }
    }
  }
`;

const { obras_aggregated } = await obtenerDatos('obras', Obras);

total.value = obras_aggregated[0].count.id;
cargando.value = false;

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Obras</h1>
  <ul class="opciones">
    <p>Hay {{ total }} obras en la colección</p>
  </ul>
</template>
