<script setup lang="ts">
import { usarGeneral } from '@/cerebros/general';

interface Props {
  completo: boolean;
}

withDefaults(defineProps<Props>(), { completo: true });

const general = usarGeneral();
</script>

<template>
  <footer>
    <div class="copy" v-html="general.guardaescobas"></div>
  </footer>
</template>

<style lang="scss">
footer {
  background-color: var(--dolor);
  color: var(--claridad);
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 2em;
}
</style>
