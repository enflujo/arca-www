<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const paises = ref([]);
const cerebroArchivo = usarArchivo();

cerebroArchivo.paginaActual = 'Ubicaciones';

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

const { paises: datosPaises } = await obtenerDatos('obrasPorPais', ObrasPorPaises);

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

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Ubicaciones</h1>
  <p v-for="pais in paises" :key="pais.slug">{{ pais.nombre }} ({{ pais.numObras }})</p>
</template>

<style lang="scss" scoped></style>
