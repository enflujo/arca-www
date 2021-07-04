<template>
  <div class="contenedor-general">
    <!-- <div class="contenedor-derecho">
      <nuxt-img src="imgs/MapaImagen.jpeg" class="mapaImagen" />
    </div>
    <div class="contenedor-izquierdo">
      <div class="contenedor-mitad"></div>
    </div> -->

    <div class="barra-derecha">
      <button class="boton-filtro" @click="actualizarFiltro('pais')">Filtrar por país</button>
      <button class="boton-filtro" @click="actualizarFiltro('autor')">Filtrar por autor</button>
      <div class="lista-paises" v-if="filtro === 'pais'">
        <h2 v-for="(pais, i) in paises" :key="`pais-${i}`" class="nombre-pais" @click="buscarPais(pais.id)">
          {{ pais.name_spanish }}
        </h2>
      </div>

      <div class="lista-paises" v-if="filtro === 'autor'">
        <h2 v-for="(autor, i) in autores" :key="`autor-${i}`" class="nombre-pais" @click="buscarAutor(autor.id)">
          {{ autor.lastname }} {{ autor.name }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';

export default {
  data() {
    return {
      paises: [],
      autores: [],
      filtro: 'null',
    };
  },

  async fetch() {
    const query = gql`
      query {
        countries {
          id
          name_spanish
        }
        authors {
          id
          lastname
          name
        }
      }
    `;

    const { countries, authors } = await this.$graphql.principal.request(query);

    if (countries && countries.length) {
      this.paises = countries.sort((a, b) => {
        const nombreA = a.name_spanish;
        const nombreB = b.name_spanish;

        if (nombreA < nombreB) {
          return -1;
        }
        if (nombreA > nombreB) {
          return 1;
        }
        return 0;
      });
    } else {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error('La página no existe');
    }
    if (authors && authors.length) {
      this.autores = authors.sort((a, b) => {
        const apellidoA = a.lastname;
        const apellidoB = b.lastname;

        if (apellidoA < apellidoB) {
          return -1;
        }
        if (apellidoA > apellidoB) {
          return 1;
        }

        return 0;
      });
    }
  },

  methods: {
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
      this.filtro = filtro;
      console.log(this.filtro);
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
  .barra-derecha {
    background-color: $profundidad;
    width: 25%;
    height: 100vh;
    z-index: 4;
    display: block;
    left: calc(100% - 25%);
    position: relative;
    overflow-y: auto;
  }
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
  .boton-filtro {
    display: flex;
    width: 30%;
    position: relative;
    justify-content: space-around;
    color: aliceblue;
  }
  .lista-paises {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    top: 100px;
    position: relative;
    padding-bottom: 80px;
  }

  .nombre-pais {
    margin: 20px;
  }
}

.transparencia {
  opacity: 0.4;
  display: block;
  top: 0px;
  position: absolute;
}
</style>
