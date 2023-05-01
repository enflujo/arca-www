<script setup>
import { usarGeneral } from '~/cerebros/general';

const cerebroGeneral = usarGeneral();
const ruta = useRoute();
const nombreColeccion = `categorias${ruta.params.numero}`;
const nombreCampo = `categoria${ruta.params.numero}`;
// La galería se encarga de los elementosCabeza() para SEO.

const singular = computed(() => {
  const datos = cerebroGeneral.paginasArchivo.find((pagina) => pagina.coleccion === 'categorias1');

  if (datos) {
    if (datos.titulo_singular) {
      return datos.titulo_singular;
    }
  }

  return 'Categoría';
});
definePageMeta({ layout: 'archivo', keepalive: true });
</script>

<template>
  <Galeria :coleccion="nombreColeccion" :nombreCampo="nombreCampo" :singular="singular" :slug="ruta.params.slug" />
</template>
