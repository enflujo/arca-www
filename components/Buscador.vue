<template>
  <div class="contenedor-general">
    <div class="buscador">
      <input v-model="searchQuery" type="search" placeholder="buscar" @keyup="validarBusqueda" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      obras: [],
    };
  },

  computed: {
    filtro() {
      return this.$store.state.general.filtro;
    },
  },
  methods: {
    validarBusqueda(evento) {
      if (evento.keyCode === 13) {
        this.$store.dispatch('buscador/buscarDirectus', this.searchQuery);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
*,
*::before,
*::after {
  box-sizing: content-box;
}

input {
  border: 2px solid $dolor;
  border-radius: 25px;
  width: 90%;
  display: flex;
  height: 40px;
  justify-content: center;
  background-color: #faf5ec;
  font-family: 'Work Sans';
  text-align: center;
  text-transform: uppercase;
  // position: fixed;
  // top: 90px;
  // left: 10px;
}
.imagenes {
  display: flex;
  position: absolute;
  top: 100px;
  left: 25vw;
}
img {
  margin: 10px;
}
</style>
