<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos, urlImagen } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosRelato = ref(null);
const obras = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'relatos';
  const Relato = gql`
  query {
    relatos_visuales(filter: { slug: { _eq: "${ruta.params.relato}" } }, limit: 1) {
      nombre,
      obras {
        titulo,
        imagen {
          id,
          title
        },
        autores {
          autores_id {
            nombre,
            apellido
          }
        }
      }
    }
  }
  `;
  const { relatos_visuales } = await obtenerDatos(Relato);

  datosRelato.value = relatos_visuales[0];
  obras.value = datosRelato.value.obras;

  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosRelato">
    <h1>{{ datosRelato.nombre }}</h1>
    <Galeria :obras="obras" />
  </div>
</template>
