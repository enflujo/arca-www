<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosRostro = ref(null);
const obras = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'rostros';

  const Rostro = gql`
  query {
    rostros(filter: { slug: { _eq: "${ruta.params.rostro}" } }, limit: 1) {
      nombre
      obras {
        id
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
  const { rostros } = await obtenerDatos(Rostro);

  datosRostro.value = rostros[0];
  obras.value = datosRostro.value.obras;
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosRostro">
    <h1>{{ datosRostro.nombre }}</h1>
    <Galeria :obras="obras" />
  </div>
</template>
