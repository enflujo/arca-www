<script setup>
const props = defineProps({
  numeroObras: Number,
});
</script>

<template>
  <p class="nombre">Numero de obras: {{ props.numeroObras }}</p>
</template>

<style lang="scss" scoped>
.contenedor {
}

.nombre {
}
</style>
