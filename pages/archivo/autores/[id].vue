<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosAutor = ref(null);
const obras = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'autores';

  const Autor = gql`
  query {
    autores_by_id(id: ${ruta.params.id}) {
      nombre
      apellido

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
  const { autores_by_id: autor } = await obtenerDatos(Autor);

  datosAutor.value = autor;
  obras.value = autor.obras.map((obra) => obra.obras_id);
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosAutor">
    <h1>{{ datosAutor.nombre }} {{ datosAutor.apellido }}</h1>
    <Galeria :obras="obras" />
  </div>
</template>
