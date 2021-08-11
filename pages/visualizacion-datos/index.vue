<template>
  <div>
    <template v-if="$fetchState.pending">
      <!-- <div class="contenedor">
        <div class="centrar-contenido"> -->
      <h1>Pendiente...</h1>
    </template>

    <template v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </template>

    <template v-else>
      <Filtros paises="paises" filtro="filtro" />
      <!-- <div class="seleccionadas"> -->
      <div class="tercer-cuadro">
        <div class="circulo"></div>
        <div class="texto-tercer">
          <span class="resaltar-tamano"> {{ $store.state.buscador.seleccionados.length }} </span>
          obras de <span class="resaltar-color">{{ mostrarAutorOPais() }}</span> en la colección.
        </div>
      </div>
      <!-- </div> -->
      <MapaDashboard :pagina="pagina" :obras="obras" />
      <div class="parte-inferior">
        <div class="imagenes-triangulares">
          <img
            v-for="(obra, i) in obras"
            id="arca-mascara"
            :key="`obra-${i}`"
            :src="urlImagen(obras[i].image)"
            :alt="obras.title"
            width="190"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';
import { crearHead, urlImagen } from '../../utilidades/ayudas';
export default {
  layout: 'dashboard',
  data() {
    return {
      pagina: {},
      obras: [],
      paises: {},
    };
  },
  async fetch() {
    const query = gql`
      query {
        paginas(filter: { slug: { _eq: "mapa" } }, limit: 1) {
          titulo
          slug
          descripcion
          contenido
          banner {
            id
            title
          }
        }
        artworks {
          id
          title
          annotation_date
          latitude_current
          longitude_current
          actual_country_id {
            id
            name_spanish
          }
        }
      }
    `;
    const { paginas, artworks } = await this.$graphql.principal.request(query);
    if (paginas.length && paginas[0].slug) {
      this.pagina = paginas[0];
    } else {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error('La página no existe');
    }
    if (artworks && artworks.length) {
      this.obras = artworks;
    }
  },
  head() {
    return crearHead(
      this.$store.state.general.datos.nombre,
      this.pagina.titulo,
      this.pagina.descripcion,
      this.pagina.banner,
      this.$nuxt.$route.path
    );
  },
  computed: {
    obrasSeleccionadas() {
      //  console.log(this.$store.state.buscador.seleccionados);
      return this.$store.state.buscador.seleccionados;
    },
  },
  watch: {
    obrasSeleccionadas(obras) {
      this.obras = obras;
    },
  },
  methods: {
    mostrarAutorOPais() {
      let obrasSeleccionadas = [];
      const filtro = this.$store.state.general.filtro;
      if (this.$store.state.buscador.seleccionados.length) {
        if (filtro === 'autor') {
          obrasSeleccionadas = this.$store.state.buscador.seleccionados[0].author_id.lastname;
        } else if (filtro === 'pais') {
          obrasSeleccionadas = this.$store.state.buscador.seleccionados[0].actual_country_id.name_spanish;
        }
        return obrasSeleccionadas;
      }
    },
    urlImagen(objImg, key) {
      return objImg && objImg.id ? urlImagen(objImg.id, key) : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.seleccionadas {
  display: block;
  position: absolute;
  margin: 3em;
  top: 100;
  left: 100;
  width: 100vw;
  height: 100vh;
}
.tercer-cuadro {
  width: 25vw;
  height: 30vh;
  z-index: 4;
  display: flex;
  position: absolute;
  top: 10%;
  left: 50vw;
  overflow-y: auto;
  .circulo {
    width: 80px;
    height: 80px;
    background-color: $dolor;
    border-radius: 200px;
    align-self: center;
    position: relative;
    left: 30px;
  }
  .texto-tercer {
    display: flex;
    width: 60%;
    align-self: center;
    left: 60px;
    position: relative;
    flex-direction: column;
    font-family: $fuenteSec;
    .resaltar-tamano {
      font-size: 3em;
    }
    .resaltar-color {
      color: $dolor;
    }
  }
}
.parte-inferior {
  position: absolute;
  top: 50vh;
}
img {
  max-width: 200px;
}
// #mapa {
//   clip-path: inset(32% 65% 10% 15% round 400px);
// }
// .contenedor-general {
//   display: block;
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100vw;
//   height: 100vh;
//   .contenedor-derecho {
//     position: absolute;
//     width: 50vw;
//     left: 50vw;
//     height: 100vh;
//     .mapaImagen {
//       right: 0px;
//       height: 100vh;
//     }
//   }
//   .contenedor-izquierdo {
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 50vw;
//     height: 100vh;
//     background-color: $profundidad;
//     .contenedor-mitad {
//       color: $claridad;
//       position: relative;
//       top: 100px;
//       display: flex;
//       justify-content: center;
//       flex-direction: column;
//       align-items: center;
//     }
//   }
// }
// .transparencia {
//   opacity: 0.4;
//   display: block;
//   top: 0px;
//   position: absolute;
// }
</style>
