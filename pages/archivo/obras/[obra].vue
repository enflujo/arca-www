<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos, urlImagen } from '~~/utilidades/ayudas';

const cargando = ref(true);
const obra = ref(null);
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
  `;

  const { obras } = await obtenerDatos(Obra);
  obra.value = obras[0];

  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />

  <div id="contenedorObra" v-if="obra">
    <h1>{{ obra.titulo }}</h1>
    <h2>
      <span v-if="obra.autores[0].autores_id.nombre">{{ obra.autores[0].autores_id.nombre }}, </span>
      {{ obra.autores[0].autores_id.apellido }}
    </h2>
    <div id="contenedorImagen"><img class="imagen" :src="urlImagen(obra.imagen.id)" :alt="obra.titulo" /></div>
  </div>
</template>

<style lang="scss" scoped>
#contenedorObra {
  display: block;
  margin: 2em auto;
  text-align: center;
}
.imagen {
  height: auto;
  width: 50vw;
  margin: 1em;
}
</style>
