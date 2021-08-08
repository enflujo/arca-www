<template>
  <div class="contenedor-general">
    <div class="buscador">
      <input v-model="searchQuery" type="search" placeholder="buscar" @keyup="validarBusqueda" />
    </div>
  </div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';
export default {
  data() {
    return {
      searchQuery: '',
      elementos: [],
    };
  },
  async fetch() {
    if (this.searchQuery.length) {
      const queryString = this.searchQuery;
      const query = gql`
        query {
          artworks(search: "${queryString}") {
            title
          }
          countries(filter: {name: {_eq: "${queryString}"}}) {
            title
          }
        }
      `;
      const { artworks } = await this.$graphql.principal.request(query);
      if (artworks && artworks.length) {
        console.log(artworks);
        this.elementos = artworks;
      } else {
        if (process.server) {
          this.$nuxt.context.res.statusCode = 404;
        }
        throw new Error('La página no existe');
      }
    }
  },
  computed: {
    filtro() {
      return this.$store.state.general.filtro;
    },
  },
  methods: {
    validarBusqueda(evento) {
      if (evento.keyCode === 13) {
        this.$fetch();
      }
    },
    buscarPais(id) {
      this.$store.dispatch('buscador/buscar', {
        campo: 'actual_country_id',
        comparacion: id,
      });
    },
    buscarAutor(id) {
      this.$store.dispatch('buscador/buscar', {
        campo: 'author_id',
        comparacion: id,
      });
    },
    actualizarFiltro(filtro) {
      this.$store.commit('general/actualizarFiltro', filtro);
    },
  },
};
</script>

<style lang="scss" scoped>
.contenedor-general {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  // .contenedor-derecho {
  //   position: absolute;
  //   width: 50vw;
  //   left: 50vw;
  //   height: 100vh;
  //   .mapaImagen {
  //     right: 0px;
  //     height: 100vh;
  //   }
  // }
  // .contenedor-izquierdo {
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  //   width: 50vw;
  //   height: 100vh;
  //   background-color: $profundidad;
  //   .contenedor-mitad {
  //     color: $claridad;
  //     position: relative;
  //     top: 100px;
  //     display: flex;
  //     justify-content: center;
  //     flex-direction: column;
  //     align-items: center;
  //   }
  // }
  .buscador {
    margin: 0.5em;
  }
}
.transparencia {
  opacity: 0.4;
  display: block;
  top: 0px;
  position: absolute;
}
</style>
