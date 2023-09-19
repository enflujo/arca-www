<script setup lang="ts">
import { usarGeneral } from '~/cerebros/general';

const cerebroGeneral = usarGeneral();
const ruta = useRoute();
const nombreColeccion = `categorias${ruta.params.numero}`;
const nombreCampo = `categoria${ruta.params.numero}`;
const slug = ruta.params.slug as string;
// La galería se encarga de los elementosCabeza() para SEO.

const singular = computed(() => {
  const datos = cerebroGeneral.paginasArchivo.find((pagina) => pagina.coleccion === 'categorias1');
  return datos && datos.titulo_singular ? datos.titulo_singular : 'Categoría';
});
definePageMeta({ layout: 'archivo', keepalive: true });
</script>

<template>
  <Galeria :coleccion="nombreColeccion" :nombreCampo="nombreCampo" :singular="singular" :slug="slug" />
</template>
