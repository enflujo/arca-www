<template>
  <div class="categorias-seleccionadas">
    <span v-if="mostrarEtiqueta">
      <nuxt-link :to="`/archivo`">
        <div class="categoria" @click="borrarEtiqueta">{{ busqueda }} X</div>
      </nuxt-link>
    </span>
    <!-- <div class="categoria">Historia X</div>
    <div class="categoria">Ciclo Pasion X</div>
    <div class="categoria">Viacrucis X</div>
    <div class="categoria">Eclesiastico X</div> -->
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
  data() {
    return {
      mostrarEtiqueta: true,
    };
  },
  methods: {
    borrarEtiqueta() {
      this.mostrarEtiqueta = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.categorias-seleccionadas {
  height: 40px;
  border-bottom: 1px solid $mediana;
  flex: 0 0 100%;
  text-align: center;
  display: flex;
  align-items: center;
  .categoria {
    background-color: $dolor;
    color: $mediana;
    border-radius: 30px;
    margin-left: 10px;
    padding: 5px 15px 5px 15px;
    font-family: $fuenteMenu;
    cursor: pointer;
    font-size: 0.8em;
    text-transform: capitalize;
    letter-spacing: 1px;
  }
  .categoria-sinselec {
    background-color: $mediana;
    color: $dolor;
    border-radius: 30px;
    margin-left: 10px;
    padding: 5px 15px 5px 15px;
    font-family: $fuenteMenu;
    cursor: pointer;
    border: 1px solid $dolor;
  }
}
</style>
