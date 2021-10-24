<template>
  <div class="buscador">
    <input v-model="searchQuery" type="search" placeholder="buscar" @keyup="validarBusqueda" />
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

  methods: {
    validarBusqueda(evento) {
      if (evento.key === 'Enter') {
        this.$router.push(`/archivo/${this.searchQuery}`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
  margin-left: 5%;
}
input:focus {
  outline: none;
}
</style>
