<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

/**
 * Operaciones en el servidor
 */
const ruta = useRoute();
const llave = `categorias${ruta.params.numero}_by_id`;

const Categoria = gql`
query {
  ${llave}(id: ${ruta.params.id}) {
    id
    nombre
  }
}
`;

const respuesta = await obtenerDatos(`categorias${ruta.params.numero}-${ruta.params.id}`, Categoria);
const datos = respuesta[llave];

/**
 * Operaciones en el cliente
 */
const obras = ref([]);
const cerebroArchivo = usarArchivo();

const ObrasCategoria = gql`
query {
  ${llave}(id: ${ruta.params.id}) {
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
  obras.value = respuesta[llave].obras;
});

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Categoria: {{ datos.nombre }}</h1>
  <Cargador v-if="pending" />
  <GaleriaMosaico v-else :obras="obras" />
</template>
