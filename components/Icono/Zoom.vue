<script setup lang="ts">
interface Props {
  vistaCompleta: boolean;
}

defineProps<Props>();
</script>

<template>
  <svg class="iconoZoom" viewBox="0 0 20 20" stroke="none">
    <title>Icono para cambiar el tamaño de la imagen</title>
    <g transform="matrix(0.8333334 0 0 0.8333334 0 0)">
      <path
        v-if="vistaCompleta"
        d="M22.154 2.554L16.707 8L21 8L21 9L15 9L15 3L16 3L16 7.293L21.446 1.8460002L22.154 2.554zM2.553999 22.154L8 16.707L8 21L9 21L9 15L3 15L3 16L7.293 16L1.8460002 21.446zM22.154 21.446999L16.707 16L21 16L21 15L15 15L15 21L16 21L16 16.707L21.446 22.153zM1.846 2.554L7.293 8L3 8L3 9L9 9L9 3L8 3L8 7.293L2.554 1.846z"
      />

      <path
        v-else
        d="M9.354 15.354L3.7 21L8 21L8 22L2 22L2 16L3 16L3 20.285L8.646 14.646L9.354 15.354zM22 2L16 2L16 3L20.3 3L14.646 8.646L15.353 9.354L21 3.715L21 8L22 8zM16 22L22 22L22 16L21 16L21 20.285L15.354 14.646L14.647 15.354L20.3 21L16 21zM8 2L2 2L2 8L3 8L3 3.715L8.646 9.354L9.353 8.646L3.7 3L8 3z"
      />
    </g>
  </svg>
</template>
