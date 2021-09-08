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
        <div class="fondo-izquierda">
          <h2 class="logo-texto">ARCA</h2>
        </div>
        <nav class="barra-izquierda">
          <div class="busqueda">
            <Buscador />
          </div>
          <div class="barra-texto">
            <h3 class="seccion" @click="colapsarCategorias">Categorías</h3>
            <ul v-if="categoriasVisible">
              <li v-for="(cat1, i) in Object.keys(categorias).sort()" :key="`cat1${i}`" class="cat categoria1 cerrado">
                <span v-if="Object.keys(categorias[cat1]).length" class="abrir" @click="abrir">+</span>
                <span @click="buscar('category_1_id', cat1, 'name')">{{ cat1 }}</span>

                <ul v-if="Object.keys(categorias[cat1]).length">
                  <li
                    v-for="(cat2, i2) in Object.keys(categorias[cat1]).sort()"
                    :key="`cat2${i2}`"
                    class="cat categoria2 cerrado"
                  >
                    <span v-if="Object.keys(categorias[cat1][cat2]).length" class="abrir" @click="abrir">+</span>
                    <span @click="buscar('category_2_id', cat2, 'name')">{{ cat2 }}</span>

                    <ul v-if="Object.keys(categorias[cat1][cat2]).length">
                      <li
                        v-for="(cat3, i3) in Object.keys(categorias[cat1][cat2]).sort()"
                        :key="`cat3${i3}`"
                        class="cat categoria3 cerrado"
                      >
                        <span v-if="Object.keys(categorias[cat1][cat2][cat3]).length" class="abrir" @click="abrir"
                          >+</span
                        >
                        <span @click="buscar('category_3_id', cat3, 'name')">{{ cat2 }}</span>
                        {{ cat3 }}

                        <ul v-if="Object.keys(categorias[cat1][cat2][cat3]).length">
                          <li
                            v-for="(cat4, i4) in Object.keys(categorias[cat1][cat2][cat3]).sort()"
                            :key="`cat4${i4}`"
                            class="cat categoria4 cerrado"
                          >
                            <span
                              v-if="Object.keys(categorias[cat1][cat2][cat3][cat4]).length"
                              class="abrir"
                              @click="abrir"
                              >+</span
                            >
                            <span @click="buscar('category_4_id', cat4, 'name')">{{ cat2 }}</span>
                            {{ cat4 }}

                            <ul v-if="Object.keys(categorias[cat1][cat2][cat3][cat4]).length">
                              <li
                                v-for="(cat5, i5) in Object.keys(categorias[cat1][cat2][cat3][cat4]).sort()"
                                :key="`cat5${i5}`"
                                class="cat categoria5 cerrado"
                              >
                                <span @click="buscar('category_5_id', cat5, 'name')">{{ cat2 }}</span>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>

            <div class="pantalla">
              <h3 class="seccion" @click="colapsarAutores">Autores</h3>
              <ul v-if="autoresVisible">
                <li
                  v-for="(autor, i) in autores"
                  :key="`autor${i}`"
                  class="lista-autores"
                  @click="buscar('author_id', autor.id)"
                >
                  {{ autor.lastname }} {{ autor.name }}
                </li>
              </ul>
            </div>
            <div class="pantalla">
              <h3 class="seccion" @click="colapsarPaises">Países</h3>
              <ul v-if="paisesVisible">
                <li
                  v-for="(pais, i) in paises"
                  :key="`autor${i}`"
                  class="lista-autores"
                  @click="buscar('actual_country_id', pais.id)"
                >
                  {{ pais.name_spanish }}
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <section class="imagenes">
          <div class="descripcion-datos">
            <h4>500 obras en la coleccion representan la categoria Cristologico</h4>
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
                <h3>Cristologico</h3>
                <p class="descripcion">Cristologico lorem ipsum dolor sit amet</p>
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
  layout: 'archivo',
  data() {
    return {
      pagina: {},
      categorias: {},
      obras: [],
      autores: [],
      paises: [],
      categoriasVisible: true,
      subcategoriasVisible: true,
      autoresVisible: true,
      paisesVisible: true,
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

        artworks(limit: 50) {
          id
          title
          category_1_id {
            id
            name
          }
          category_2_id {
            id
            name
          }
          category_3_id {
            id
            name
          }
          category_4_id {
            id
            name
          }
          category_5_id {
            id
            name
          }
        }

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

    const { paginas, artworks, countries, authors } = await this.$graphql.principal.request(query);

    if (paginas.length && paginas[0].slug) {
      this.pagina = paginas[0];
    } else {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error('La página no existe');
    }

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

    if (artworks && artworks.length) {
      const categorias = {};

      artworks.forEach((work) => {
        const cat1 = work.category_1_id ? work.category_1_id : null;
        const cat2 = work.category_2_id ? work.category_2_id.name : null;
        const cat3 = work.category_3_id ? work.category_3_id.name : null;
        const cat4 = work.category_4_id ? work.category_4_id.name : null;
        const cat5 = work.category_5_id ? work.category_5_id.name : null;

        if (cat1) {
          if (!categorias[cat1.name]) {
            categorias[cat1.name] = {};
          }

          if (cat2) {
            if (!categorias[cat1.name][cat2]) {
              categorias[cat1.name][cat2] = {};
            }

            if (cat3) {
              if (!categorias[cat1.name][cat2][cat3]) {
                categorias[cat1.name][cat2][cat3] = {};
              }

              if (cat4) {
                if (!categorias[cat1.name][cat2][cat3][cat4]) {
                  categorias[cat1.name][cat2][cat3][cat4] = {};
                }
                if (cat5) {
                  if (!categorias[cat1.name][cat2][cat3][cat4][cat5]) {
                    categorias[cat1.name][cat2][cat3][cat4][cat5] = {};
                  }
                }
              }
            }
          }
        }
      });

      this.categorias = categorias;
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
    urlImagen(objImg, key) {
      return objImg && objImg.id ? urlImagen(objImg.id, key) : '';
    },
    // TODO: Volver una sola función con parámetros
    colapsarCategorias() {
      if (this.categoriasVisible === true) {
        this.categoriasVisible = false;
      } else {
        this.categoriasVisible = true;
      }
    },
    colapsarSubcategorias() {
      if (this.subcategoriasVisible === true) {
        this.subcategoriasVisible = false;
      } else {
        this.subcategoriasVisible = true;
      }
    },
    colapsarAutores() {
      if (this.autoresVisible === true) {
        this.autoresVisible = false;
      } else {
        this.autoresVisible = true;
      }
    },
    colapsarPaises() {
      if (this.paisesVisible === true) {
        this.paisesVisible = false;
      } else {
        this.paisesVisible = true;
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
    buscar(campo, comparacion, campo2) {
      this.$store.dispatch('buscador/buscar', {
        campo,
        comparacion,
        campo2,
      });
    },

    abrir(evento) {
      const contenedor = evento.target.parentElement;
      contenedor.classList.toggle('cerrado');
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
.fondo-izquierda {
  background-color: $mediana;
  height: 100vh;
  width: 20vw;
  // flex-direction: column;
  // align-items: center;
  // align-items: center;
  overflow-x: auto;
  position: absolute;
  border-right: 2px solid $dolor;
}
.barra-izquierda {
  z-index: 3;
}
.barra-texto {
  width: 20vw;
  padding-left: 20px;
  margin-top: 120px;
  z-index: 2;
  height: calc(100vh - 165px);
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
  // height: calc(100vh - 120px);

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

.pantalla {
  margin-top: 10px;
}
ul {
  list-style: none;
  margin: 0.5em 1em;
  font-family: $fuenteMenu;
}
.seccion {
  margin-bottom: 10px;
  font-family: $fuenteSec;
  cursor: pointer;
}

nav li {
  cursor: pointer;
}

.cat {
  &.cerrado {
    height: 1.2em;
  }
}
</style>
