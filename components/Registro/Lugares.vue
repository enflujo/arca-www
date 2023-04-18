<script setup>
const props = defineProps({
  datos: Array,
  titulo: String,
});
</script>

<template>
  <section v-if="datos && datos.length" class="seccion">
    <h3>{{ titulo }}</h3>
    <p>
      <span v-for="(lugar, i) in datos" :key="`ubicacion${lugar.url}`">
        <span v-if="i > 0" class="separador">|</span>

        <NuxtLink :to="lugar.url"> {{ lugar.nombre }} </NuxtLink>
      </span>
    </p>
  </section>
</template>

<style lang="scss" scoped>
.separador {
  padding: 0 0.3em;
}
</style>
