<template>
  <nav id="barra-izquierda">
    <nuxt-link :to="'/'">
      <h2 class="logo-texto">ARCA</h2>
    </nuxt-link>

    <Buscador />

    <div class="barra-texto">
      <h3 class="seccion" @click="desplegar">Categorías</h3>
      <ul class="opciones">
        <li
          v-for="(cat1, i) in Object.keys(categorias).sort()"
          :key="`cat1${i}`"
          class="cat categoria1 cerrado"
          :class="{ categoriaLarga: cat1.length > 12 }"
        >
          <span v-if="Object.keys(categorias[cat1]).length" class="abrir" @click="abrir">+</span>
          <nuxt-link :to="`/categoria/${cat1}?page=1`">{{ cat1 }}</nuxt-link>

          <ul v-if="Object.keys(categorias[cat1]).length">
            <li
              v-for="(cat2, i2) in Object.keys(categorias[cat1]).sort()"
              :key="`cat2${i2}`"
              class="cat categoria2 cerrado"
              :class="{ categoriaLarga: cat2.length > 12 }"
            >
              <span v-if="Object.keys(categorias[cat1][cat2]).length" class="abrir" @click="abrir">+</span>

              <nuxt-link :to="`/categoria/${cat2}?page=1`">{{ cat2 }}</nuxt-link>

              <ul v-if="Object.keys(categorias[cat1][cat2]).length">
                <li
                  v-for="(cat3, i3) in Object.keys(categorias[cat1][cat2]).sort()"
                  :key="`cat3${i3}`"
                  class="cat categoria3 cerrado"
                  :class="{ categoriaLarga: cat3.length > 12 }"
                >
                  <span v-if="Object.keys(categorias[cat1][cat2][cat3]).length" class="abrir" @click="abrir">+</span>
                  <nuxt-link :to="`/categoria/${cat3}?page=1`">{{ cat3 }}</nuxt-link>

                  <ul v-if="Object.keys(categorias[cat1][cat2][cat3]).length">
                    <li
                      v-for="(cat4, i4) in Object.keys(categorias[cat1][cat2][cat3]).sort()"
                      :key="`cat4${i4}`"
                      class="cat categoria4 cerrado"
                      :class="{ categoriaLarga: cat4.length > 12 }"
                    >
                      <span v-if="Object.keys(categorias[cat1][cat2][cat3][cat4]).length" class="abrir" @click="abrir"
                        >+</span
                      >

                      <nuxt-link :to="`/categoria/${cat4}?page=1`">{{ cat4 }}</nuxt-link>
                      <ul v-if="Object.keys(categorias[cat1][cat2][cat3][cat4]).length">
                        <li
                          v-for="(cat5, i5) in Object.keys(categorias[cat1][cat2][cat3][cat4]).sort()"
                          :key="`cat5${i5}`"
                          class="cat categoria5"
                          :class="{ categoriaLarga: cat5.length > 12 }"
                        >
                          <nuxt-link :to="`/categoria/${cat5}?page=1`">{{ cat5 }}</nuxt-link>
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
        <h3 class="seccion" @click="desplegar">Autores</h3>
        <ul class="iniciales">
          <li
            v-for="(inicial, i) in iniciales"
            :key="`inicial${i}`"
            :class="`inicial ${inicialSeleccionada === inicial ? 'nuxt-link-exact-active' : ''}`"
            @click="elegirInicial(inicial)"
          >
            {{ inicial }}
          </li>
        </ul>

        <ul v-if="inicialSeleccionada != ''" class="opciones">
          <li v-for="(autor, i) in autoresPorInicial(inicialSeleccionada)" :key="`autor${i}`" class="enlace-menu">
            <nuxt-link :to="`/autor/${autor.id}?page=1`">{{ autor.apellido }} {{ autor.nombre }}</nuxt-link>
          </li>
        </ul>
      </div>

      <div class="pantalla">
        <h3 class="seccion" @click="desplegar">Países</h3>
        <ul class="opciones">
          <li v-for="(pais, i) in paises" :key="`pais${i}`" class="enlace-menu">
            <nuxt-link :to="`/mapa/${pais.nombre_es}?page=1`">{{ pais.nombre_es }}</nuxt-link>
          </li>
        </ul>
      </div>

      <div class="pantalla">
        <h3 class="seccion" @click="desplegar">Fisiognómica</h3>
        <ul class="opciones">
          <li v-for="(posicion, i) in fisiognomica" :key="`posicion${i}`" class="enlace-menu">
            <nuxt-link :to="`/archivo/${fisiognomica[0].nombre}?page=1`">{{ fisiognomica[i].nombre }}</nuxt-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { gql } from 'nuxt-graphql-request';
import { urlImagen, extraerPrimeraLetra, eliminarTildes } from '../utilidades/ayudas';
export default {
  data() {
    return {
      pagina: {},
      categorias: {},
      obras: [],
      autores: [],
      paises: [],
      fisiognomica: [],
      iniciales: new Set(),
      inicialSeleccionada: '',
    };
  },
  async fetch() {
    const query = gql`
      query {
        paises_lista {
          nombre_es
        }
        obra(limit: 50) {
          arca_id
          clasificacion {
            categorias_lista_id {
              nombre
              ascendencia
            }
          }
        }
        autores(limit: -1) {
          id
          nombre
          apellido
        }
        fisiognomica_lista {
          nombre
        }
      }
    `;
    /* eslint-disable camelcase */
    const { paises_lista, obra, autores, fisiognomica_lista } = await this.$graphql.principal.request(query);

    this.obras = obra;
    if (autores && autores.length) {
      this.autores = autores;
    }

    if (paises_lista && paises_lista.length) {
      this.paises = paises_lista.sort((a, b) => {
        const nombreA = a.nombre_es;
        const nombreB = b.nombre_es;
        if (nombreA < nombreB) {
          return -1;
        }
        if (nombreA > nombreB) {
          return 1;
        }
        return 0;
      });
    }

    if (fisiognomica_lista && fisiognomica_lista.length) {
      this.fisiognomica = fisiognomica_lista;
    } else {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error('La página no existe');
    }

    // TODO: ¿Cómo se resuelve de nuevo la lista de categorías?
    // obra.forEach((element) => console.log(element.clasificacion[0].categorias_lista_id.nombre));

    /* if (obra && obra.length) {
      const categorias = {};
      obra.forEach((work) => {
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
    } */
    this.cargarIniciales();
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
    desplegar(evento) {
      const contenedor = evento.target.parentElement;
      contenedor.classList.toggle('abierto');
    },
    abrir(evento) {
      const contenedor = evento.target.parentElement;
      contenedor.classList.toggle('cerrado');
      // contenedor.classList.toggle('categoriaLarga');
    },

    cargarIniciales() {
      const iniciales = [];
      for (const autor in this.autores) {
        const inicial = extraerPrimeraLetra(this.autores[autor].apellido).toUpperCase();

        if (inicial !== '') {
          iniciales.push(inicial);
        }
      }

      this.iniciales = Array.from(new Set(iniciales)).sort();
    },

    elegirInicial(inicial) {
      this.inicialSeleccionada = inicial;
    },

    autoresPorInicial(inicial) {
      return this.autores
        .filter((autor) => extraerPrimeraLetra(autor.apellido) === inicial)
        .sort((a, b) => {
          const apellidoA = eliminarTildes(a.apellido.toUpperCase());
          const apellidoB = eliminarTildes(b.apellido.toUpperCase());

          if (apellidoA < apellidoB) return -1;
          if (apellidoA > apellidoB) return 1;
          return 0;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
#barra-izquierda {
  background-color: $mediana;
  border-right: 2px solid $dolor;
  position: fixed;
  overflow: auto;
  width: 280px;
  height: 100vh;
}
.logo-texto {
  margin: 20px;
  font-family: $fuentePrincipal;
}

li {
  margin-bottom: 0.2em;
}

.barra-texto {
  padding-left: 20px;
  margin-top: 2em;
}
.pantalla {
  margin-top: 10px;
  height: 1.7em;
  &.abierto {
    height: fit-content;
  }
}

ul {
  margin-right: 0.2em;
  margin-left: 0.8em;
  padding-top: 0.5em;
  font-family: $fuenteMenu;

  &.opciones {
    overflow: visible;
  }
}

.seccion {
  margin-bottom: 10px;
  font-family: $fuentePrincipal;
  cursor: pointer;
}

.iniciales {
  margin-bottom: 1em;
  height: auto;
}

.inicial {
  display: inline;
  margin-bottom: 1em;
  cursor: pointer;
}

.enlace-menu {
  margin-bottom: 0.4em;
  font-size: 0.85em;
  position: relative;

  &::before {
    content: '';
    width: 3px;
    height: 3px;
    border-radius: 50%;
    display: block;
    background-color: $dolor;
    position: absolute;
    left: -9px;
    top: 0.5em;
  }
}

.cat {
  width: auto;
  overflow: hidden;
  margin-bottom: 0.2em;
  &.cerrado {
    height: 1.2em;
  }
  &.categoriaLarga {
    height: 3em;
  }
  &.categoria5 {
    height: fit-content;
  }
}

.nuxt-link-exact-active {
  font-weight: bold;
}
</style>
