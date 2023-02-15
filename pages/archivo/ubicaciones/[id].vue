<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

/**
 * Operaciones en el servidor
 */
const ruta = useRoute();
const Ubicacion = gql`
query {
  ubicaciones_by_id(id: ${ruta.params.id}) {
    id
    nombre
  }
}
`;

const { ubicaciones_by_id: datosUbicacion } = await obtenerDatos('autor', Ubicacion);

useHead(elementosCabeza(datosUbicacion, ruta.path)); // SEO

/**
 * Operaciones en el cliente
 */
const obras = ref([]);
const cerebroArchivo = usarArchivo();

cerebroArchivo.paginaActual = 'Ubicaciones';

const ObrasUbicacion = gql`
query {
  ubicaciones_by_id(id: ${ruta.params.id}) {
    obras(limit: ${cerebroArchivo.obrasPorPagina}) {
      id
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

const { data, pending } = obtenerDatosAsinc(`obrasAutor${datosUbicacion.id}`, ObrasUbicacion);

watch(data, ({ ubicaciones_by_id }) => {
  obras.value = ubicaciones_by_id.obras;
});

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Ubicación: {{ datosUbicacion.nombre }}</h1>
  <Cargador v-if="pending" />
  <GaleriaMosaico v-else :obras="obras" />
</template>
