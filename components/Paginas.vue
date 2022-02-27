<template>
  <div class="paginas">
    <div v-for="(pagina, i) in paginas" :key="`pagina-${i}`" class="num-pag">
      <nuxt-link :to="`${ruta}?page=${pagina}`"> {{ pagina }} </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0,
    },
    ruta: {
      type: String,
      default: '',
    },
  },

  data() {
    return { paginas: [] };
  },

  created() {
    const obrasPorPagina = 100;
    const cantidadObras = Math.ceil(this.total / obrasPorPagina);
    this.paginas = Array.from({ length: cantidadObras }, (_, index) => index + 1);
  },
};
</script>

<style lang="scss" scoped>
.paginas {
  display: flex;
  width: 50%;
  flex-wrap: wrap;
}

// .paginas {
//   display: flex;
//   width: 110vw;
//   justify-self: center;
//   align-self: center;
//   margin: 10px;
//   justify-content: center;
//   position: absolute;
//   bottom: 20px;

//   .pag-cont {
//     width: 350px;
//     display: flex;
//     border: 2px solid $profundidad;
//     border-radius: 200px;
//     justify-content: center;

//     .num-pag {
//       display: flex;
//       justify-content: center;
//       align-self: center;
//       text-align: center;
//       padding: 10px;
//     }
//   }
// }
</style>
