<script setup>
import { usarGeneral } from '~/cerebros/general';
import { gql } from '~/utilidades/ayudas';

const cerebroGeneral = usarGeneral();
const ruta = useRoute();
const tipoPagina = ref('');
const [indice, slug] = ruta.params.slug;
const esPaginaGeneral = cerebroGeneral.paginas.find((pagina) => pagina.slug === indice);
const datos = ref();
if (esPaginaGeneral) {
  tipoPagina.value = 'general';
  definePageMeta({ layout: 'paginas' });
} else {
  const esPaginaArchivo = cerebroGeneral.paginasArchivo.find((pagina) => pagina.slug === indice);

  if (esPaginaArchivo) {
    if (!slug) {
      tipoPagina.value = 'archivoIndice';

      const Indice = gql`
        query {
          paginas_archivo(filter: { slug: { _eq: "${indice}" } }) {
            descripcion
            coleccion
            banner {
              id
              title
            }
          }
        }
      `;
      const { paginas_archivo } = await obtenerDatos(`indice${indice}`, Indice);

      const { descripcion, banner } = paginas_archivo[0];

      datos.value = { ...esPaginaArchivo, ...paginas_archivo[0] };
      console.log(datos.value);
      definePageMeta({ layout: 'archivo' });
      useHead(elementosCabeza({ titulo: esPaginaArchivo.titulo, descripcion, banner }, ruta.path));
    } else {
      const Indice = gql`
        query {
          paginas_archivo(filter: { slug: { _eq: "${indice}" } }) {
            descripcion
            coleccion
            titulo_singular
            banner {
              id
              title
            }
          }
        }
      `;
      const { paginas_archivo } = await obtenerDatos(`galeria${indice}${slug}`, Indice);

      datos.value = { ...esPaginaArchivo, ...paginas_archivo[0] };
      definePageMeta({ layout: 'archivo', keepalive: true });
      tipoPagina.value = 'archivoSingular';
    }
  } else {
    throw createError({ statusCode: 404, statusMessage: 'La página no existe', fatal: true });
  }
}

//
</script>

<template>
  <PaginaGeneral v-if="tipoPagina === 'general'" :slug="indice" />
  <template v-else-if="tipoPagina === 'archivoIndice'">
    <h1>{{ datos.titulo }}</h1>
    <Vista :coleccion="datos.coleccion" :slug="datos.slug" />
  </template>

  <template v-else-if="tipoPagina === 'archivoSingular'">
    <Galeria :coleccion="datos.coleccion" :singular="datos.titulo_singular" :enTablaRelacional="true" />
  </template>
</template>

<style lang="scss">
.contenidoPagina {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 1em 0;
  }
}
</style>
