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

// useHead(
//   elementosCabeza(
//     {
//       nombre: crearNombre(),
//       descripcion: datosAutor.biografia,
//     },
//     ruta.path
//   )
// ); // SEO

/**
 * Operaciones en el cliente
 */
const obras = ref([]);
const cerebroArchivo = usarArchivo();

cerebroArchivo.paginaActual = 'Categorías';

const ObrasCategoria = gql`
query {
  ${llave}(id: ${ruta.params.id}) {
    obras(limit: 20) {
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

const { data, error, pending } = obtenerDatosAsinc(`obrasCategoria${datos.id}`, ObrasCategoria);

watch(data, (respuesta) => {
  obras.value = respuesta[llave].obras;
});

watch(error, (errores) => {
  console.error(errores);
});

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Categoria: {{ datos.nombre }}</h1>
  <Cargador v-if="pending" />
  <GaleriaMosaico v-else :obras="obras" />
</template>
