<template>
  <div>
    <template v-if="$fetchState.pending">
      <div class="loading-contenedor">
        <Logo class="svgDolor opac" />
        <div class="loading">
          <div class="loading-text">
            <span class="loading-text-words">A</span>
            <span class="loading-text-words">R</span>
            <span class="loading-text-words">C</span>
            <span class="loading-text-words">A</span>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="$fetchState.error">
      <div>
        <h1 class="error">{{ $fetchState.error.message }}</h1>
      </div>
    </template>

    <template v-else>
      <div class="contenedor-pagina">
        <!-- <DescripcionGaleria v-if="obras.length < 100" :numero="obras.length" :busqueda="$route.params.autor" /> -->
        <EtiquetasGaleria :busqueda="$route.params.autor" />
        <Galeria :obras="obras" />
        <MenuVistas :busqueda="$route.params.autor" />
      </div>
      <span class="paginas">
        <div v-if="obras.length == 100" class="pag-cont">
          <div v-for="(page, i) in pages" :key="`page-${i}`" class="num-pag" @click="$fetch">
            <nuxt-link :to="`/autor/${autor}?page=${page}`"> {{ page }} </nuxt-link>
          </div>
        </div>
      </span>
    </template>
  </div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';

export default {
  layout: 'conBuscador',
  data() {
    return {
      pagina: {},
      obras: [],
      pages: [...Array(11).keys()].splice(1),
      autor: '',
    };
  },

  async fetch() {
    const autor = (this.autor = this.$route.params.autor);
    const page = this.$route.query.page;

    const query = gql`
      query {
        obra(filter: { autor: { apellido: { _eq: "${autor}" } } }, page: ${page} ) {
          arca_id
          titulo
          fechas_actividad
          sintesis
          ubicacion_actual {
            nombre
            lat
            lon
          }
          imagen {
            id
          }
          autor {
            apellido
            nombre
            biografia
          }
        }
      }
    `;

    const { obra } = await this.$graphql.principal.request(query);

    if (obra && obra.length) {
      this.obras = obra;
    } else {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error('La página no existe');
    }
  },

  /**
   * TODO: ver como construir el head con datos del pais.
   */
  // head() {
  //   return crearHead(
  //     this.$store.state.general.datos.nombre,
  //     this.pagina.titulo,
  //     this.pagina.descripcion,
  //     this.pagina.banner,
  //     this.$nuxt.$route.path
  //   );
  // },
};
</script>

<style lang="scss" scoped>
.loading-contenedor {
  width: calc(100vw - 280px);
  left: 280px;
  position: relative;
  padding-left: 500px;
  padding-right: 500px;
  padding-top: 250px;
  padding-bottom: 250px;
  height: calc(100vh - 120px);
}
.svgDolor {
  fill: $dolor;
}
// .opac {
//   animation: opacidad 2s infinite;
// }
// @keyframes opacidad {
//   0% {
//     opacity: 0;
//   }
//   50% {
//     opacity: 1;
//   }
//   100% {
//     opacity: 0;
//   }
// }
.loading-text {
  height: 100px;
  text-align: center;
  span {
    display: inline-block;
    margin: 0 5px;
    color: $dolor;
    font-size: 32px;
    font-family: $fuentePrincipal;
    @for $i from 0 through 6 {
      &:nth-child(#{$i + 1}) {
        filter: blur(0px);
        animation: blur-text 1.5s (#{$i/5}) + s infinite linear alternate;
      }
    }
  }
}

@keyframes blur-text {
  0% {
    filter: blur(0px);
  }
  100% {
    filter: blur(4px);
  }
}
.paginas {
  display: flex;
  width: 110vw;
  justify-self: center;
  align-self: center;
  margin: 10px;
  justify-content: center;
  position: absolute;
  bottom: 20px;
  .pag-cont {
    width: 350px;
    display: flex;
    border: 2px solid $profundidad;
    border-radius: 200px;
    justify-content: center;
    .num-pag {
      display: flex;
      justify-content: center;
      align-self: center;
      text-align: center;
      padding: 10px;
    }
  }
}
</style>
