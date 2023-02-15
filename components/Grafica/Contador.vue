<script setup>
const props = defineProps({
  numeroObras: Number,
});
</script>

<template>
  <p>Numero de obras: {{ props.numeroObras }}</p>
</template>

<style lang="scss" scoped></style>
