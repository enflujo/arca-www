<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const paises = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true });

// Falta agregar y organizar ciudades y ubicaciones en una sola página, con un mapa

onMounted(async () => {
  cerebroArchivo.paginaActual = 'ubicaciones';

  const ObrasPorPaises = gql`
    query {
      paises(filter: { ciudades_func: { count: { _neq: 0 } } }) {
        nombre
        slug
        geo
        ciudades {
          ubicaciones {
            obras_func {
              count
            }
          }
        }
      }
    }
  `;

  const { paises: datosPaises } = await obtenerDatos(ObrasPorPaises);

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

  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Ubicaciones</h1>
  <p v-for="pais in paises" :key="pais.slug">{{ pais.nombre }} ({{ pais.numObras }})</p>
</template>

<style lang="scss" scoped></style>
