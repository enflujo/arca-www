<template>
  <div class="categorias-seleccionadas">
    <span v-if="mostrarEtiqueta">
      <nuxt-link :to="`/archivo`">
        <div class="categoria" @click="borrarEtiqueta">{{ busqueda }} X</div>
      </nuxt-link>
    </span>
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
  height: 70px;
  border-bottom: 1px solid var(--mediana);
  flex: 0 0 100%;
  text-align: center;
  display: flex;
  align-items: center;
  width: auto;
  justify-content: space-between;
  margin-right: 6%;
  margin-left: 2%;
  overflow: hidden;

  .categoria {
    background-color: var(--dolor);
    color:var(--mediana);
    border-radius: 30px;
    margin-left: 10px;
    padding: 5px 15px 5px 15px;
    font-family:var(--fuenteMenu);
    cursor: pointer;
    font-size: 0.8em;
    text-transform: capitalize;
    letter-spacing: 1px;
  }
  .categoria-sinselec {
    background-color:var(--mediana);
    color:var(--dolor);
    border-radius: 30px;
    margin-left: 10px;
    padding: 5px 15px 5px 15px;
    font-family:var(--fuenteMenu);
    cursor: pointer;
    border: 1px solid var(--dolor);
  }
}
</style>
