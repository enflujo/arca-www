<script setup>
import { usarGeneral } from '@/cerebros/general';

const general = usarGeneral();

const props = defineProps({
  completo: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <footer :class="`${completo ? 'completo' : 'dimensiones'}`">
    <div class="texto-f-uno">
      <span class="copy" v-html="general.guardaescobas"></span>
    </div>
  </footer>
</template>

<style lang="scss">
footer {
  background-color: var(--dolor);
  color: var(--claridad);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 2em;
}
</style>
