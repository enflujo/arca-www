<template>
  <div class="contenedor-general">
    <div class="buscador">
      <input v-model="searchQuery" type="search" placeholder="buscar" @keyup="validarBusqueda" />
    </div>
    <div class="imagenes">
      <img
        v-for="(obra, i) in obras"
        :key="`obra-${i}`"
        :src="urlImagen(obras[i].image)"
        :alt="obras.title"
        width="190"
        id="arca-mascara"
      />
    </div>
  </div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';
import { urlImagen } from '../utilidades/ayudas';

export default {
  data() {
    return {
      searchQuery: '',
      obras: [],
    };
  },
  async fetch() {
    if (this.searchQuery.length) {
      const queryString = this.searchQuery;
      const query = gql`
        query {
          artworks(search: "${queryString}") {
            title
            image {
            id
            title
          }
          }
          
        }
      `;
      const { artworks } = await this.$graphql.principal.request(query);
      if (artworks && artworks.length) {
        console.log(artworks);
        this.obras = artworks;
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
    urlImagen(objImg, key) {
      return objImg && objImg.id ? urlImagen(objImg.id, key) : '';
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
