<script setup>
import { usarGeneral } from '~~/cerebros/general';
import { gql } from '~~/utilidades/ayudas';

const ruta = useRoute();
const general = usarGeneral();

const infoGeneral = ref([]);

const Info = gql`
  query {
    paginas(filter: { slug: { _eq: "sobre-arca" } }, limit: 1) {
      titulo
      slug
      descripcion
      banner {
        id
        title
      }
      titulo_parrafo
      texto_parrafo
      titulo_parrafo_2
      texto_parrafo_2
      titulo_parrafo_3
      texto_parrafo_3
      titulo_parrafo_4
      texto_parrafo_4
    }
  }
`;

// obtenerDatosAsinc se usa para obtener datos de forma reactiva, no estática.
// Para obtener los datos estáticos (ej. "head") se usa la función con await. Ej. archivo - index.vue
const { data, pending } = obtenerDatosAsinc('info', Info);
const pagina = ref(null);

watch(data, ({ paginas: datosPagina }) => {
  pagina.value = datosPagina[0];
});
</script>

<template>
  <Cargador v-if="pending" />
  <div v-else id="sobre-arca">
    <h1 class="titulo logo-texto claridad">{{ pagina.titulo }}</h1>
    <h2 class="titulo-parrafo">{{ pagina.titulo_parrafo }}</h2>
    <p class="parrafo">{{ pagina.texto_parrafo }}</p>
    <h2 class="titulo-parrafo">{{ pagina.titulo_parrafo_2 }}</h2>
    <p class="parrafo">{{ pagina.texto_parrafo_2 }}</p>
    <h2 class="titulo-parrafo">{{ pagina.titulo_parrafo_3 }}</h2>
    <p class="parrafo">{{ pagina.texto_parrafo_3 }}</p>
    <h2 class="titulo-parrafo">{{ pagina.titulo_parrafo_4 }}</h2>
    <p class="parrafo">{{ pagina.texto_parrafo_4 }}</p>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

#sobre-arca {
  width: 80%;
  margin: 10vh auto;
}

.titulo {
  margin-bottom: 1em;
}

.parrafo {
  margin-top: 0.5em;
  margin-bottom: 1.5em;
}
</style>
