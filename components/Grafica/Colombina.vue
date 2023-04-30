<script setup>
defineProps({
  ancho: Number,
  alto: { type: Number, default: 3 },
  radio: { type: Number, default: 8 },
  color: String,
  total: Number,
});
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
