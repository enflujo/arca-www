<template>
  <div class="descripcion-datos">
    <h4>{{ numero }} obras de {{ busqueda }} en la colección.</h4>
  </div>
</template>

<script>
export default {
  props: {
    numero: {
      type: Number,
      default: 0,
    },

    busqueda: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.descripcion-datos {
  height: 40px;
  border-bottom: 1px solid $mediana;
  flex: 0 0 100%;
  text-align: center;
  padding-top: 10px;
}
</style>
