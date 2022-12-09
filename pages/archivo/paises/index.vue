<script setup>
const ubicaciones = ref([]);

definePageMeta({ layout: 'con-buscador' });

const { data, error } = await useAsyncGql('Ubicaciones');
ubicaciones.value = data.value.ubicaciones;
</script>

<template>
  <div class="pagina">
    <!-- <Cargador v-if="$fetchState.pending" /> -->

    <!-- <div v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </div> -->

    <div class="contenido">
      <Mapa :datos="ubicaciones" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
