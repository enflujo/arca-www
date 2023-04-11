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

// ¿'autor' debería reemplazarse por 'ubicación'?
const { ubicaciones_by_id: datosUbicacion } = await obtenerDatos('autor', Ubicacion);

useHead(elementosCabeza(datosUbicacion, ruta.path)); // SEO

/**
 * Operaciones en el cliente
 */
const obras = ref([]);
const cerebroArchivo = usarArchivo();

const ObrasUbicacion = gql`
query {
  ubicaciones_by_id(id: ${ruta.params.id}) {
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

// ¿'obrasAutor' debería reemplazarse por 'obrasUbicación'?
const { data, pending } = obtenerDatosAsinc(`obrasAutor${datosUbicacion.id}`, ObrasUbicacion);

watch(data, ({ ubicaciones_by_id }) => {
  obras.value = ubicaciones_by_id.obras;
});

definePageMeta({ layout: 'archivo', keepalive: true });
</script>

<template>
  <h1>Ubicación: {{ datosUbicacion.nombre }}</h1>
  <Cargador v-if="pending" />
  <GaleriaMosaico v-else :obras="obras" />
</template>
