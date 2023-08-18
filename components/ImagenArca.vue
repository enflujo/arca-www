<script setup lang="ts">
import { urlImagen } from '~/utilidades/ayudas';
import type { Imagen } from 'tipos';

interface Props {
  datos: Imagen;
  titulo: string;
  llave: string;
  rutaIcono: string;
}

const props = withDefaults(defineProps<Props>(), {
  rutaIcono: '/arca-icono-amarillo.svg',
});

const imagen: Ref<HTMLImageElement | null> = ref(null);

onMounted(() => {
  if (!imagen.value) return;
  duranteInterseccion(
    imagen.value,
    () => {
      if (imagen.value) imagen.value.src = urlImagen(props.datos.id, props.llave); // 554
    },
    true,
    { threshold: 0.1 }
  );
});
</script>

<template>
  <img
    ref="imagen"
    class="perezoso"
    :src="`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='black' viewBox='0 0 ${datos.ancho} ${datos.alto}'%3E%3C/svg%3E`"
    :style="`background-image: url(${rutaIcono}); width:${datos.ancho ? `${datos.ancho}px` : 'auto'}`"
    :alt="datos.title || titulo"
    :width="datos.ancho"
    :height="datos.alto"
  />
</template>

<style lang="scss" scoped>
img {
  background-repeat: no-repeat;
  background-size: 50px;
  background-position: center;
  line-height: 0;
}
</style>
