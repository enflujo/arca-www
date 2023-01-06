<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const datosAutor = ref(null);
const obras = ref([]);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

cerebroArchivo.paginaActual = 'Autores';

const Autor = gql`
query {
  autores_by_id(id: ${ruta.params.id}) {
    id
    nombre
    apellido
  }
}
`;

const ObrasAutor = gql`
query {
  autores_by_id(id: ${ruta.params.id}) {
    obras(limit: 20) {
      obras_id {
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
}
`;

const { autores_by_id: autorGeneral } = await obtenerDatos('autor', Autor);
const { data, error, pending, refresh } = obtenerDatosAsinc('obrasAutor', ObrasAutor);

datosAutor.value = autorGeneral;

watch(data, ({ autores_by_id }) => {
  obras.value = autores_by_id.obras.map((obra) => obra.obras_id);
});

watch(error, (errores) => {
  console.error(errores);
});

onMounted(() => {
  if (!obras.value.length) {
    refresh();
  }
});

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>{{ datosAutor.nombre }} {{ datosAutor.apellido }}</h1>
  <Cargador v-if="pending" />
  <Galeria v-else :obras="obras" />
</template>
