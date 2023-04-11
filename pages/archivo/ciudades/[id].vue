<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

/**
 * Operaciones en el servidor
 */
const ruta = useRoute();
const Ciudad = gql`
query {
  ciudades_by_id(id: ${ruta.params.id}) {
    id
    nombre
    pais {
      nombre
    }
  }
}
`;

const { ciudades_by_id: datosCiudad } = await obtenerDatos('ciudad', Ciudad);

useHead(elementosCabeza(datosCiudad, ruta.path)); // SEO

/**
 * Operaciones en el cliente
 */
const obras = ref([]);
const cerebroArchivo = usarArchivo();

const ObrasCiudad = gql`
query {
  ciudades_by_id(id: ${ruta.params.id}) {
    obras(limit: ${cerebroArchivo.obrasPorPagina}) {
      registro
      titulo
      imagen {
        id,
        title
      }
      autores {
        autores_id {
          nombre
          apellido
        }
      }
    }
  }
}
`;

const { data, pending } = obtenerDatosAsinc(`obrasCiudad${datosCiudad.id}`, ObrasCiudad);

watch(data, ({ ciudades_by_id }) => {
  obras.value = ciudades_by_id.obras;
});

definePageMeta({ layout: 'archivo', keepalive: true });
</script>

<template>
  <h1>Ciudad: {{ datosCiudad.nombre }}, {{ datosCiudad.pais.nombre }}</h1>
  <Cargador v-if="pending" />
  <GaleriaMosaico v-else :obras="obras" />
</template>
