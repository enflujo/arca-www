<script setup lang="ts">
import { apiBase } from '~/config/general';

interface Props {
  /** Ruta relativa en el API/Directus, lo que va después de `/admin/content/...` */
  url: string;
}
defineProps<Props>();
</script>

<template>
  <a class="editarDatos" :href="`${apiBase}/admin/content/${url}`" target="_blank">
    <img src="~/assets/imgs/editar.svg" alt="icono para editar metadatos" />
  </a>
</template>

<style lang="scss" scoped>
.editarDatos {
  position: absolute;
  right: 5px;
  top: 5px;

  img {
    width: 20px;
    height: auto;
  }
}
</style>
