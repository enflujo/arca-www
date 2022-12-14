<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosGesto = ref(null);
const obras = ref(null);
const obrasProcesadas = ref([]);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'gestos';

  const Gesto = gql`
  query {
    gestos(filter: { slug: { _eq: "${ruta.params.gesto}" } }, limit: 1) {
    nombre
    obras {
          obras_id {
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
  const { gestos } = await obtenerDatos(Gesto);
  datosGesto.value = gestos[0];
  obras.value = datosGesto.value.obras;

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
  <div v-if="datosGesto">
    <h1>{{ datosGesto.nombre }}</h1>
    <Galeria :obras="obrasProcesadas" />
  </div>
</template>
