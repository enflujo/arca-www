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
      secciones
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
    <h2 class="titulo-parrafo">{{ pagina.secciones[0].titulo }}</h2>
    <span class="parrafo" v-html="pagina.secciones[0].texto"></span>
    <h2 class="titulo-parrafo">{{ pagina.secciones[1].titulo }}</h2>
    <span class="parrafo" v-html="pagina.secciones[1].texto"></span>
    <h2 class="titulo-parrafo">{{ pagina.secciones[2].titulo }}</h2>
    <span class="parrafo" v-html="pagina.secciones[2].texto"></span>
    <h2 class="titulo-parrafo">{{ pagina.secciones[3].titulo }}</h2>
    <span class="parrafo" v-html="pagina.secciones[3].texto"></span>
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
  display: block;
  margin-top: 0.5em;
  margin-bottom: 1.5em;
}
</style>
