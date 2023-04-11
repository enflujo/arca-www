<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

/**
 * Operaciones en el servidor
 */
const ruta = useRoute();
const llave = `categorias${ruta.params.numero}`;

const Categoria = gql`
query {
  ${llave}(filter: { slug: {_eq: "${ruta.params.slug}" } }) {
    id
    nombre
  }
}
`;

const respuesta = await obtenerDatos(`categorias${ruta.params.numero}-${ruta.params.slug}`, Categoria);
const datos = respuesta[llave][0];

/**
 * Operaciones en el cliente
 */
const obras = ref([]);
const cerebroArchivo = usarArchivo();

const ObrasCategoria = gql`
query {
  ${llave}(filter: { slug: {_eq: "${ruta.params.slug}" } }) {
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

const { data, pending } = obtenerDatosAsinc(`obrasCategoria${datos.id}`, ObrasCategoria);

watch(data, (respuesta) => {
  obras.value = respuesta[llave][0].obras;
});

definePageMeta({ layout: 'archivo', keepalive: true });
</script>

<template>
  <h1>Categoría: {{ datos.nombre }}</h1>
  <Cargador v-if="pending" />
  <GaleriaMosaico v-else :obras="obras" />
</template>
