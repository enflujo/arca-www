<script setup lang="ts">
const props = defineProps({
  actualizarPagina: {
    type: Function,
    default: null,
  },
  numeroPaginas: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <ul id="menuPaginas">
    <li v-for="pagina in numeroPaginas" :key="`pagina${pagina}`" class="pagina" @click="actualizarPagina(pagina)">
      <NuxtLink :to="`?pagina=${pagina}`">{{ pagina }} </NuxtLink>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
#menuPaginas {
  border-left: 1px black solid;
  position: fixed;
  top: 85px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.pagina {
  font-size: 0.7em;
  margin: 0 0.3em;
}
</style>
