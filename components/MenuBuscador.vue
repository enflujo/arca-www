<template>
  <nav id="barra-izquierda">
    <nuxt-link :to="'/'">
      <h2 class="logo-texto">ARCA</h2>
    </nuxt-link>

    <Buscador />

    <div class="barra-texto">
      <div class="pantalla">
        <h3 class="seccion" @click="desplegar">Categorías</h3>
        <ul class="opciones">
          <li v-for="(categoria, i) in categorias" :key="`categoria${i}`" class="enlace-menu">
            <nuxt-link :to="`/archivo/${categoria.id}?page=1`">{{ categoria.nombre }}</nuxt-link>
          </li>
        </ul>
      </div>

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
        <h3 class="seccion" @click="desplegar">Características</h3>
        <ul class="opciones">
          <li v-for="(caracteristica, i) in caracteristicas" :key="`posicion${i}`" class="enlace-menu">
            <nuxt-link :to="`/archivo/caracteristica/${caracteristica.id}?page=1`">{{
              caracteristicas[i].nombre
            }}</nuxt-link>
          </li>
        </ul>
      </div>

      <div class="pantalla">
        <h3 class="seccion" @click="desplegar">Cartela - Filacteria</h3>
        <ul class="opciones">
          <li v-for="(item, i) in cartelaFilacteria" :key="`cartela${i}`" class="enlace-menu">
            <nuxt-link :to="`/archivo/${cartelaFilacteria[0].nombre}?page=1`">{{
              cartelaFilacteria[i].nombre
            }}</nuxt-link>
          </li>
        </ul>
      </div>

      <div class="pantalla">
        <h3 class="seccion" @click="desplegar">Descriptores</h3>
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
          <li
            v-for="(descriptor, i) in descriptorPorInicial(inicialSeleccionada)"
            :key="`descriptor${i}`"
            class="enlace-menu"
          >
            <nuxt-link :to="`/archivo/descriptor/${descriptor.id}?page=1`">{{ descriptor.descripcion }}</nuxt-link>
          </li>
        </ul>
      </div>

      <div class="pantalla">
        <h3 class="seccion" @click="desplegar">Donantes</h3>
        <ul class="opciones">
          <li v-for="(donante, i) in donantes" :key="`donante${i}`" class="enlace-menu">
            <nuxt-link :to="`/archivo/${donantes[0].nombre}?page=1`">{{ donantes[i].nombre }}</nuxt-link>
          </li>
        </ul>
      </div>

      <div class="pantalla">
        <h3 class="seccion" @click="desplegar">Escenarios</h3>
        <ul class="opciones">
          <li v-for="(escenario, i) in escenarios" :key="`escenario${i}`" class="enlace-menu">
            <nuxt-link :to="`/archivo/${escenarios[0].nombre}?page=1`">{{ escenarios[i].nombre }}</nuxt-link>
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

      <div class="pantalla">
        <h3 class="seccion" @click="desplegar">Gestos</h3>
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
          <li
            v-for="(gesto, i) in menuPorInicial(inicialSeleccionada, 'gestos')"
            :key="`gesto${i}`"
            class="enlace-menu"
          >
            <nuxt-link :to="`/archivo/${gesto.nombre}?page=1`">{{ gesto.nombre }}</nuxt-link>
          </li>
        </ul>
      </div>

      <div class="pantalla">
        <h3 class="seccion" @click="desplegar">Objetos</h3>
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
          <li
            v-for="(objeto, i) in menuPorInicial(inicialSeleccionada, 'objetos')"
            :key="`objeto${i}`"
            class="enlace-menu"
          >
            <nuxt-link :to="`/archivo/${objeto.nombre}?page=1`">{{ objeto.nombre }}</nuxt-link>
          </li>
        </ul>
      </div>

      <div class="pantalla">
        <h3 class="seccion" @click="desplegar">Relatos visuales</h3>
        <ul class="opciones">
          <li v-for="(relato, i) in relatos" :key="`relato${i}`" class="enlace-menu">
            <nuxt-link :to="`/archivo/${relatos[0].nombre}?page=1`">{{ relatos[i].nombre }}</nuxt-link>
          </li>
        </ul>
      </div>

      <div class="pantalla">
        <h3 class="seccion" @click="desplegar">Símbolos</h3>
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
          <li
            v-for="(simbolo, i) in menuPorInicial(inicialSeleccionada, 'simbolos')"
            :key="`simbolo${i}`"
            class="enlace-menu"
          >
            <nuxt-link :to="`/archivo/simbolo/${simbolo.id}?page=1`">{{ simbolo.nombre }}</nuxt-link>
          </li>
        </ul>
      </div>

      <div class="pantalla">
        <h3 class="seccion" @click="desplegar">Técnicas</h3>
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
          <li
            v-for="(tecnica, i) in menuPorInicial(inicialSeleccionada, 'tecnicas')"
            :key="`tecnica${i}`"
            class="enlace-menu"
          >
            <nuxt-link :to="`/archivo/${tecnica.nombre}?page=1`">{{ tecnica.nombre }}</nuxt-link>
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
      obras: [],
      autores: [],
      paises: [],
      categorias: [],
      caracteristicas: [],
      cartelaFilacteria: [],
      descriptores: [],
      donantes: [],
      escenarios: [],
      fisiognomica: [],
      gestos: [],
      objetos: [],
      relatos: [],
      simbolos: [],
      tecnicas: [],
      iniciales: new Set(),
      inicialSeleccionada: '',
    };
  },
  async fetch() {
    const query = gql`
      query {
        paises_lista(sort: ["sort", "nombre_es"], limit: -1) {
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
        categorias_lista(sort: ["sort", "nombre"], filter: { arca_id: { _lt: 12 } }) {
          id
          nombre
        }
        caracteristicas_particulares_lista(sort: ["sort", "nombre"], limit: -1) {
          id
          nombre
        }
        cartela_filacteria_lista(sort: ["sort", "nombre"], limit: -1) {
          arca_id
          nombre
        }
        descriptores_lista(sort: ["sort", "descripcion"], limit: -1) {
          id
          descripcion
        }
        donante_lista(sort: ["sort", "nombre"], limit: -1) {
          arca_id
          nombre
        }
        escenarios_lista(sort: ["sort", "nombre"], limit: -1) {
          arca_id
          nombre
        }
        fisiognomica_lista(sort: ["sort", "nombre"], limit: -1) {
          id
          nombre
        }
        gestos_lista(sort: ["sort", "nombre"], limit: -1) {
          arca_id
          nombre
        }
        objetos_lista(sort: ["sort", "nombre"], limit: -1) {
          arca_id
          nombre
        }
        relato_visual_lista(sort: ["sort", "nombre"], limit: -1) {
          arca_id
          nombre
        }
        simbolos_lista(sort: ["sort", "nombre"], limit: -1) {
          id
          nombre
        }
        tecnica_lista(sort: ["sort", "nombre"], limit: -1) {
          arca_id
          nombre
        }
      }
    `;
    /* eslint-disable camelcase */
    const {
      paises_lista,
      obra,
      autores,
      categorias_lista,
      caracteristicas_particulares_lista,
      cartela_filacteria_lista,
      descriptores_lista,
      donante_lista,
      escenarios_lista,
      fisiognomica_lista,
      gestos_lista,
      objetos_lista,
      relato_visual_lista,
      simbolos_lista,
      tecnica_lista,
    } = await this.$graphql.principal.request(query);

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
    if (categorias_lista && categorias_lista.length) {
      this.categorias = categorias_lista;
    }
    if (caracteristicas_particulares_lista && caracteristicas_particulares_lista.length) {
      this.caracteristicas = caracteristicas_particulares_lista;
    }
    if (cartela_filacteria_lista && cartela_filacteria_lista.length) {
      this.cartelaFilacteria = cartela_filacteria_lista;
    }
    if (descriptores_lista && descriptores_lista.length) {
      this.descriptores = descriptores_lista;
    }
    if (donante_lista && donante_lista.length) {
      this.donantes = donante_lista;
    }
    if (escenarios_lista && escenarios_lista.length) {
      this.escenarios = escenarios_lista;
    }
    if (fisiognomica_lista && fisiognomica_lista.length) {
      this.fisiognomica = fisiognomica_lista;
    }
    if (gestos_lista && gestos_lista.length) {
      this.gestos = gestos_lista;
    }
    if (objetos_lista && objetos_lista.length) {
      this.objetos = objetos_lista;
    }
    if (relato_visual_lista && relato_visual_lista.length) {
      this.relatos = relato_visual_lista;
    }
    if (simbolos_lista && simbolos_lista.length) {
      this.simbolos = simbolos_lista;
    }
    if (tecnica_lista && tecnica_lista.length) {
      this.tecnicas = tecnica_lista;
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

    descriptorPorInicial(inicial) {
      return this.descriptores.filter((descriptor) => extraerPrimeraLetra(descriptor.descripcion) === inicial);
    },

    menuPorInicial(inicial, menu) {
      return this[menu].filter((item) => extraerPrimeraLetra(item.nombre) === inicial);
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
  width: 15vw;
  height: 100vh;
}
.logo-texto {
  margin: 1vw;
  font-family: $fuentePrincipal;
  overflow: hidden;
}

li {
  margin-bottom: 0.2em;
}

.barra-texto {
  padding-left: 1vw;
  margin-top: 2em;
}
.pantalla {
  margin-top: 1.1vh;
  height: 1em;
  overflow: hidden;
  &.abierto {
    height: fit-content;
  }
}

ul {
  margin-right: 0.2em;
  margin-left: 0.8em;
  padding-top: 0.5em;
  font-family: $fuenteMenu;
  font-size: 0.9em;

  &.opciones {
    overflow: visible;
  }
}

.seccion {
  font-family: $fuentePrincipal;
  font-size: 0.9em;
  cursor: pointer;
  overflow: hidden;
}

.iniciales {
  margin-bottom: 1em;
  height: auto;
  font-size: 1em;
}

.inicial {
  display: inline;
  margin-bottom: 1em;
  cursor: pointer;
}

.enlace-menu {
  margin-bottom: 0.4em;
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
