<script setup>
const props = defineProps({
  numeroObras: Number,
});
</script>

<template>
  <p class="nombre">{{ props.numeroObras }} obras en la colección</p>
</template>

<style lang="scss" scoped>
.contenedor {
}

.nombre {
}
</style>
