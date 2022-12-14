<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosPersonaje = ref(null);
const obras = ref(null);
const obrasProcesadas = ref([]);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'personajes';

  const Personaje = gql`
  query {
    personajes(filter: { slug: { _eq: "${ruta.params.personaje}" } }, limit: 1) {
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
  const { personajes } = await obtenerDatos(Personaje);

  datosPersonaje.value = personajes[0];
  obras.value = datosPersonaje.value.obras;

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
  <div v-if="datosPersonaje">
    <h1>{{ datosPersonaje.nombre }}</h1>
    <Galeria :obras="obrasProcesadas" />
  </div>
</template>
