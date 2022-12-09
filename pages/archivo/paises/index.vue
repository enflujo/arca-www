<script setup>
const ubicaciones = ref([]);

definePageMeta({ layout: 'con-buscador' });

const { data, error } = await useAsyncGql('Ubicaciones');
ubicaciones.value = data.value.ubicaciones;
</script>

<template>
  <div class="pagina">
    <h1>Index de países</h1>
  </div>
</template>

<style lang="scss" scoped></style>
