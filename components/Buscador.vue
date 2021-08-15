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
input {
  border: 2px solid #08173e;
  border-radius: 25px;
  width: 18vw;
  display: flex;
  height: 40px;
  justify-content: center;
  background-color: #faf5ec;
  font-family: 'Work Sans';
  text-align: center;
  text-transform: uppercase;
  position: relative;
}
.imagenes {
  display: block;
  position: absolute;
  top: 100px;
  left: 25vw;
}
</style>
