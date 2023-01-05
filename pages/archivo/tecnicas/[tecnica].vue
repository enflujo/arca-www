<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosTecnica = ref(null);
const obras = ref(null);
const obrasProcesadas = ref([]);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'tecnicas';

  const Tecnica = gql`
  query {
    tecnicas(filter: { slug: { _eq: "${ruta.params.tecnica}" } }, limit: 1) {
    nombre
    obras {
      obras_id {
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
  }
  `;
  const { tecnicas } = await obtenerDatos(Tecnica);

  datosTecnica.value = tecnicas[0];
  obras.value = datosTecnica.value.obras;

  /* Cuando las obras vienen de una tabla relacional muchos-a-muchos, hay que procesarlas para que el código
  del componente Galería funcione.*/
  obras.value.forEach((obra) => {
    obrasProcesadas.value.push(obra.obras_id);
  });

  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />
  <div v-if="datosTecnica">
    <h1>{{ datosTecnica.nombre }}</h1>
    <Galeria :obras="obrasProcesadas" />
  </div>
</template>
