<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosFisiognomicaImagen = ref(null);
const obras = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'fisiognomicaImagen';

  const FisiognomicaImagen = gql`
  query {
    fisiognomicas_imagen(filter: { slug: { _eq: "${ruta.params.fisiognomicaImagen}" } }, limit: 1) {
    nombre
    obras {
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
  const { fisiognomicas_imagen } = await obtenerDatos(FisiognomicaImagen);

  datosFisiognomicaImagen.value = fisiognomicas_imagen[0];
  obras.value = datosFisiognomicaImagen.value.obras;

  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosFisiognomicaImagen">
    <h1>{{ datosFisiognomicaImagen.nombre }}</h1>
    <Galeria :obras="obras" />
  </div>
</template>
