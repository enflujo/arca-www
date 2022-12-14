<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const datosObra = ref(null);
const cerebroArchivo = usarArchivo();
const ruta = useRoute();

definePageMeta({ layout: 'default', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'obras';

  const Obra = gql`
  query {
    obras(filter: { id: { _eq: "${ruta.params.obra}" } }, limit: 1) {
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
  `;

  const { obras } = await obtenerDatos(Obra);
  datosObra.value = obras[0];

  console.log(datosObra);

  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />

  <div id="contenedorObra" v-if="datosObra">
    <h1>{{ datosObra.titulo }}</h1>
    <h2>
      <span v-if="datosObra.autores[0].autores_id.nombre">{{ datosObra.autores[0].autores_id.nombre }}, </span>
      {{ datosObra.autores[0].autores_id.apellido }}
    </h2>
  </div>
</template>
