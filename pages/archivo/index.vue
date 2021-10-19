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
            <!-- <h4>{{ obras.length }} obras de {{ busquedaActual }} en la colección.</h4>
          --></div>
          <div class="agrupar-elementos">
            <div class="todas-images">
              <div v-for="(obra, i) in obras" :key="`obra-${i}`" class="imagen">
                <nuxt-link :to="`/imagen/${obra.id}`">
                  <img :src="urlImagen(obras[i].image)" :alt="obras.title" />
                  <div class="informacion-hover">
                    <h2 class="nombre-obra-hover">{{ obra.title }}</h2>
                    <h3 class="nombre-autor-hover">{{ obra.author_id.name }} {{ obra.author_id.lastname }}</h3>
                    <p class="descripcion-hover">{{ obra.synthesis.substr(0, 60) + '\u2026' }}</p>
                    <h3 class="boton-detalles">DETALLES -></h3>
                  </div>
                </nuxt-link>
              </div>
            </div>
            <div class="barra-detalles">
              <div class="cambio-vista">
                <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29">
                  <g id="Group_595" data-name="Group 595" transform="translate(-1853 -447)">
                    <g id="Group_585" data-name="Group 585" transform="translate(1853.472 447)">
                      <path
                        id="Ellipse_57"
                        data-name="Ellipse 57"
                        d="M14.5,2A12.5,12.5,0,0,0,5.661,23.339,12.5,12.5,0,0,0,23.339,5.661,12.418,12.418,0,0,0,14.5,2m0-2A14.5,14.5,0,1,1,0,14.5,14.5,14.5,0,0,1,14.5,0Z"
                        transform="translate(-0.472 0)"
                        fill="#af2828"
                      />
                    </g>
                    <g id="Group_586" data-name="Group 586" transform="translate(20 10)">
                      <rect
                        id="Rectangle_139"
                        data-name="Rectangle 139"
                        width="5"
                        height="5"
                        transform="translate(1842 446)"
                        fill="#af2828"
                      />
                      <rect
                        id="Rectangle_141"
                        data-name="Rectangle 141"
                        width="5"
                        height="5"
                        transform="translate(1842 452)"
                        fill="#af2828"
                      />
                      <rect
                        id="Rectangle_140"
                        data-name="Rectangle 140"
                        width="5"
                        height="5"
                        transform="translate(1848 446)"
                        fill="#af2828"
                      />
                      <rect
                        id="Rectangle_142"
                        data-name="Rectangle 142"
                        width="5"
                        height="5"
                        transform="translate(1848 452)"
                        fill="#af2828"
                      />
                    </g>
                  </g>
                </svg>
                <input id="switch" type="checkbox" /><label for="switch">Toggle</label>
                <svg xmlns="http://www.w3.org/2000/svg" width="24.393" height="24.403" viewBox="0 0 24.393 24.403">
                  <g id="Group_581" data-name="Group 581" transform="translate(0 0)">
                    <path
                      id="Path_1123"
                      data-name="Path 1123"
                      d="M79.785,134.263A12.216,12.216,0,0,0,90.793,116.8c-.012-.033-.026-.065-.041-.1s-.025-.045-.038-.067a12.2,12.2,0,1,0-10.93,17.63ZM88.191,116.7,80.9,120.254v-8.124a9.9,9.9,0,0,1,7.287,4.573Zm-9.525-4.572v9.915a1.12,1.12,0,0,0,1.61,1.006l8.893-4.335a9.952,9.952,0,1,1-10.5-6.586Z"
                      transform="translate(-67.587 -109.859)"
                      fill="#c6c6c6"
                    />
                  </g>
                </svg>
              </div>
              <!-- <div class="descripcion-categoria">
                <h3>{{ busquedaActual }}</h3>
                <p class="descripcion">{{ busquedaActual }} lorem ipsum dolor sit amet</p>
              </div>
              <Mapa /> -->
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
.nombre-obra-hover {
  color: $claridad;
  letter-spacing: 0;
  font-size: 1.4em;
}
.nombre-autor-hover {
  color: $claridad;
  letter-spacing: 0;
  font-size: 1.1em;
  font-weight: 400;
  position: relative;
  top: 8px;
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
  width: 5%;
  justify-content: space-around;
  align-content: center;
}
.agrupar-elementos {
  display: flex;
  height: calc(100vh - 40px);
}
.todas-images {
  display: grid;
  width: 95%;
  height: calc(100vh - 140px);
  grid-gap: 10px;
  padding: 10px;
  grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
  grid-auto-rows: minmax(32.8%, auto);
  grid-auto-flow: dense;
  overflow: hidden;
  .imagen {
    border-radius: 10px;
    overflow: hidden;
    background-size: cover;
  }
  .informacion-hover {
    position: absolute;
    color: $claridad !important;
    padding: 20px;
    opacity: 0;
    background-color: $dolor;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    text-transform: none;
    z-index: 999999;
    .nombre-hover {
      color: $claridad;
      letter-spacing: 0;
    }
    .descripcion-hover {
      letter-spacing: 0;
      margin-top: 10px;
      line-height: 1.5;
    }
  }
  .informacion-hover:hover {
    opacity: 0.8;
    transition: 0.5s;
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

input[type='checkbox'] {
  height: 0;
  width: 0;
  visibility: hidden;
  position: absolute;
  top: 0;
  left: 0;
}

label {
  cursor: pointer;
  text-indent: -9999px;
  width: 50px;
  height: 30px;
  border: 2px solid $dolor;
  background: transparent !important;
  display: block;
  border-radius: 100px;
  position: relative;
  transform: rotate(90deg);
}

label:after {
  content: '';
  position: absolute;
  top: 5px;
  left: 5px;
  width: 15px;
  height: 15px;
  border: 2px solid $dolor;
  border-radius: 90px;
  transition: 0.3s;
}

input:checked + label {
  background: transparent;
}

input:checked + label:after {
  left: calc(100% - 5px);
  transform: translateX(-100%);
}

label:active:after {
  width: 15px;
}
.cambio-vista {
  height: 150px;
  justify-content: space-around;
  align-items: center;
  display: flex;
  flex-direction: column;
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

.Group_581 {
  display: flex;
}

.boton-detalles {
  font-weight: 500;
  font-size: 0.75em;
  position: relative;
  top: 20px;
  text-align: flex-end;
}
</style>
