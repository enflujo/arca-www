<script setup lang="ts">
import type { Pagina } from '~/tipos';
import { gql } from '~/utilidades/ayudas';

export interface Informacion extends Pagina {
  secciones: { titulo: string; texto: string }[];
}

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
const pagina: Ref<Informacion | null> = ref(null);

watch(data, ({ paginas }) => {
  pagina.value = paginas[0];
});
</script>

<template>
  <Cargador v-if="pending" />

  <div v-else-if="pagina" id="sobreArca">
    <h1>{{ pagina.titulo }}</h1>

    <div v-for="(seccion, i) in pagina.secciones" :key="`seccion${i}`" class="seccion">
      <h2 class="tituloSeccion">{{ seccion.titulo }}</h2>
      <div class="contenidoSeccion" v-html="seccion.texto"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

#sobreArca {
  width: 80%;
  margin: 10vh auto;
}

.contenidoSeccion {
  display: block;
  margin-top: 0.5em;
  margin-bottom: 1.5em;
}
</style>
