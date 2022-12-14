<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosCartelaFilacteria = ref(null);
const obras = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'cartelaFilacteria';

  const CartelaFilacteria = gql`
  query {
    cartelas_filacterias(filter: { slug: { _eq: "${ruta.params.cartela}" } }, limit: 1) {
    nombre
    obras {
        titulo,
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
  const { cartelas_filacterias } = await obtenerDatos(CartelaFilacteria);

  datosCartelaFilacteria.value = cartelas_filacterias[0];
  obras.value = datosCartelaFilacteria.value.obras;
  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosCartelaFilacteria">
    <h1>{{ datosCartelaFilacteria.nombre }}</h1>
    <Galeria :obras="obras" />
  </div>
</template>
