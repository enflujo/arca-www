<script setup lang="ts">
interface Props {
  ancho: number;
  alto?: number;
  radio?: number;
  color: string;
  total: number;
}

withDefaults(defineProps<Props>(), { alto: 3, radio: 8 });
</script>

<template>
  <span class="colombina">
    <span class="lineaColombina" :style="`width:${ancho}%; height:${alto}px; background-color:${color}`"></span>
    <span class="circuloColombina" :style="`background-color:${color}; width:${radio}px; height:${radio}px`"></span>
    <span class="conteoObras">{{ total }}</span>
  </span>
</template>

<style lang="scss" scoped>
.colombina {
  display: flex;
  align-items: center;

  .lineaColombina {
    display: block;
  }
  .circuloColombina {
    display: block;
    border-radius: 50%;
  }

  .conteoObras {
    color: #788989;
    font-size: 0.75em;
    padding: 0.3em;
  }
}
</style>
