<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosObjeto = ref(null);
const obras = ref(null);
const obrasProcesadas = ref([]);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'objetos';

  const Objeto = gql`
  query {
    objetos(filter: { slug: { _eq: "${ruta.params.objeto}" } }, limit: 1) {
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
  const { objetos } = await obtenerDatos(Objeto);

  datosObjeto.value = objetos[0];
  obras.value = datosObjeto.value.obras;

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
  <div v-if="datosObjeto">
    <h1>{{ datosObjeto.nombre }}</h1>
    <Galeria :obras="obrasProcesadas" />
  </div>
</template>
