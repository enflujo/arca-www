<template>
  <div>
    <template v-if="$fetchState.pending">
      <div>
        <h1>Pendiente...</h1>
      </div>
    </template>

    <template v-else-if="$fetchState.error">
      <div>
        <h1 class="error">{{ $fetchState.error.message }}</h1>
      </div>
    </template>

    <template v-else>
      <div class="contenedor-pagina">
        <section class="imagenes">
          <div class="descripcion-datos">
            <h4>{{ obras.length }} obras de {{ busquedaActual }} en la colección.</h4>
          </div>
          <div class="agrupar-elementos">
            <div class="todas-images">
              <div v-for="(obra, i) in obras" :key="`obra-${i}`" class="imagen">
                <nuxt-link :to="`/imagen/${obra.id}`"
                  ><img :src="urlImagen(obras[i].image)" :alt="obras.title"
                /></nuxt-link>
              </div>
            </div>
            <div class="barra-detalles">
              <div class="descripcion-categoria">
                <h3>{{ busquedaActual }}</h3>
                <p class="descripcion">{{ busquedaActual }} lorem ipsum dolor sit amet</p>
              </div>
              <Mapa />
            </div>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';
import { crearHead, urlImagen } from '../../utilidades/ayudas';

export default {
  layout: 'conBuscador',
  data() {
    return {
      pagina: {},
      obras: [],
    };
  },

  async fetch() {
    const query = gql`
      query {
        paginas(filter: { slug: { _eq: "archivo" } }, limit: 1) {
          titulo
          slug
          descripcion
          contenido
          banner {
            id
            title
          }
        }
      }
    `;

    const { paginas } = await this.$graphql.principal.request(query);

    if (paginas.length && paginas[0].slug) {
      this.pagina = paginas[0];
    } else {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error('La página no existe');
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
      return this.$store.state.buscador.seleccionados;
    },

    busquedaActual() {
      return this.$store.state.buscador.busquedaActual;
    },
  },

  watch: {
    obrasSeleccionadas(obras) {
      this.obras = obras;
    },
  },

  methods: {
    urlImagen(objImg, key) {
      return objImg && objImg.id ? urlImagen(objImg.id, key) : '';
    },
  },
};
</script>

<style lang="scss" scoped>
#mapa {
  top: 0 !important;
  display: flex !important;
  width: 25vw !important;
  height: 30vh !important;
  position: relative !important;
}
.descripcion-datos {
  height: 40px;
  border-bottom: 1px solid $mediana;
  display: flex;
  justify-content: center;
  align-items: center;
}
.barra-detalles {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.agrupar-elementos {
  display: flex;
}
.todas-images {
  display: grid;
  width: 70%;
  height: calc(100vh - 40px);
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  padding: 10px;
  grid-auto-rows: minmax(100px, auto);
  .imagen {
    background-color: $dolor;
  }
}
.descripcion-categoria {
  background-color: $dolor;
  width: 350px;
  height: 200px;
  color: $claridad;
  padding: 10px;
  position: relative;
}
.busqueda {
  display: block;
  position: relative;
  top: 80px;
  left: 10px;
}
.contenedor-pagina {
  display: flex;
}
.logo-texto {
  top: 20px;
  position: relative;
  left: 20px;
}
li {
  margin-bottom: 10px;
}
.descripcion {
  margin-top: 10px;
}

.archivo {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 80vw;
  left: 20vw;
  top: 0;
  position: absolute;
  overflow-y: auto;

  .titulo {
    display: flex;
    flex-direction: column;
    height: 80px;
    justify-content: space-around;
    margin-bottom: 20px;
  }
}

.imagenes {
  width: 80vw;
  img {
    width: 100%;
    height: auto;
  }

  .caja-inicial {
    display: flex;
    justify-content: space-between;
    .caja-descripcion {
      height: auto;
      display: flex;
      flex-direction: row;
      text-align: initial;
      .descripcion {
        width: 400px;
        background-color: #af2828;
        padding: 2em;
        justify-content: space-around;
        display: flex;
        flex-direction: column;
        .titulo-obra {
          color: $claridad;
          font-weight: 300;
        }
        .subtitulo-obra {
          color: $claridad;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 5px;
        }
        .descripcion-obra {
          color: $claridad;
          line-height: 1.5;
          letter-spacing: -0.4px;
          font-size: 14px;
        }
        .boton-ver {
          border: 1px solid $claridad;
          padding: 1em;
          border-radius: 25px;
          color: $claridad;
          letter-spacing: 6px;
          letter-spacing: 6px;
          font-size: 11px;
          align-self: center;
        }
      }
    }
  }
  .caja-secundaria {
    display: flex;
    justify-content: space-between;
    top: 20px;
    position: relative;
  }
}
</style>
