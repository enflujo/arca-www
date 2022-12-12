<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos, ordenarPorNombre } from '~~/utilidades/ayudas';

const cargando = ref(true);
const gestos = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true }),
  onMounted(async () => {
    cerebroArchivo.paginaActual = 'gestos';

    const ObrasPorGestos = gql`
      query {
        gestos {
          nombre
          slug
          obras_func {
            count
          }
        }
      }
    `;

    const { gestos: datosGestos } = await obtenerDatos(ObrasPorGestos);
    ordenarPorNombre(datosGestos);
    gestos.value = datosGestos;

    cargando.value = false;
  });
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Gestos</h1>
  <p v-for="gesto in gestos" :key="gesto.slug">{{ gesto.nombre }} ({{ gesto.obras_func.count }})</p>
</template>
