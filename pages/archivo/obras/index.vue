<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos, ordenarPorNombre } from '~~/utilidades/ayudas';

const cargando = ref(true);
const obras = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true }),
  onMounted(async () => {
    cerebroArchivo.paginaActual = 'obras';

    const Obras = gql`
      query {
        obras(limit: -1) {
          id
          titulo
        }
      }
    `;

    const { obras: datosObras } = await obtenerDatos(Obras);

    obras.value = datosObras;
    cargando.value = false;

    console.log(obras.value);
  });
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Obras</h1>
  <ul class="opciones">
    <p>Hay {{ obras.length }} obras en la colección</p>
  </ul>
</template>
