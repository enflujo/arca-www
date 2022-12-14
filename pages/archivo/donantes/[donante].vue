<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosDonante = ref(null);
const obras = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'donantes';

  const Donante = gql`
  query {
    donantes(filter: { slug: { _eq: "${ruta.params.donante}" } }, limit: 1) {
      nombre
      obras {
        id
        titulo
        imagen {
          id
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
  const { donantes } = await obtenerDatos(Donante);

  datosDonante.value = donantes[0];
  obras.value = datosDonante.value.obras;
  console.log(obras.value);
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosDonante">
    <h1>{{ datosDonante.nombre }}</h1>
    <Galeria :obras="obras" />
  </div>
</template>
