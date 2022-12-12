<script setup>
import { usarArchivo } from '~~/cerebros/archivo';

const paises = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true });
onMounted(() => {
  cerebroArchivo.paginaActual = 'paises';
});

const { data, pending, error } = useAsyncGql('ObrasPorPaises', {}, { lazy: true });

watch(data, ({ paises: datosPaises }) => {
  paises.value = datosPaises
    .map((pais) => {
      // Agrupar el conteo de obras de un país en una sola variable
      let conteo = 0;
      pais.ciudades.forEach((ciudad) => {
        ciudad.ubicaciones.forEach((ubicacion) => {
          conteo += ubicacion.obras_func.count;
        });
      });

      return {
        nombre: pais.nombre,
        slug: pais.slug,
        geo: pais.geo,
        numObras: conteo,
      };
    })
    // Filtrar países que sí tienen obras.
    .filter((pais) => pais.numObras);
});
</script>

<template>
  <Cargador v-if="pending" />

  <h1>Países</h1>
  <p v-for="pais in paises" :key="pais.slug">{{ pais.nombre }} - {{ pais.slug }} - {{ pais.numObras }}</p>
</template>

<style lang="scss" scoped></style>
