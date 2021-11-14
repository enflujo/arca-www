<template>
  <div>
    <template v-if="$fetchState.pending">
      <h1>Pendiente...</h1>
    </template>

    <template v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </template>

    <template v-else>
      <!-- <div class="mediana"></div> -->
      <div class="logo-ar">
        <nuxt-link :to="'/'">
          <h2 class="logo-texto">ARCA</h2>
        </nuxt-link>
      </div>
      <div class="contenedor-centrado">
        <div class="completo-archivo">
          <div class="titulo">
            <h1>{{ obra.title }}</h1>
            <h3 class="nombre-autor">{{ `${obra.author_id.name} ${obra.author_id.lastname}` }}</h3>
          </div>
          <div class="descripcion">
            <vue-magnifier
              class="imagen-des"
              :src="urlImagen(obra.image)"
              :srcLarge="urlImagen(obra.image)"
              :alt="obra.title"
            >
            </vue-magnifier>

            <div class="hover-info">
              <div class="textos-hover">
                <h1 class="descripcion-tit">Información básica de la imagen</h1>
                <p class="descripcion-des">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam molestie tristique ullamcorper. Integer
                  porttitor nibh tincidunt, malesuada mi eu, facilisis ante. Fusce ac mi ut est fringilla blandit id sed
                  sapien. Duis vitae hendrerit lacus. Vivamus accumsan imperdiet sem eget fringilla. Ut vulputate diam
                  augue, in egestas sem consectetur ut. Nam suscipit, justo id pharetra pharetra, ligula ligula auctor
                  velit.
                </p>
              </div>
            </div>
            <!-- <p>{{ obra.annotation_date }}</p> -->
          </div>
          <div class="botonera">
            <button
              class="botones-imagen"
              :class="{ botonActivo: pestana == 'datos' }"
              @click="cambiarPestana('datos')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="40.392" height="38.168" viewBox="0 0 40.392 38.168">
                <path
                  id="Path_401"
                  data-name="Path 401"
                  d="M3.78,1.3a4.375,4.375,0,0,1,.533.97L18.188,35.388l.017.032.017.058a2.535,2.535,0,0,0,.48.756,2.071,2.071,0,0,0,2.989,0,2.536,2.536,0,0,0,.479-.755l.008-.028,13.9-33.184a4.378,4.378,0,0,1,.533-.97H3.78M.327,0H40.065a.327.327,0,0,1,.326.327.329.329,0,0,1-.3.324,3.384,3.384,0,0,0-2.806,2.09L23.4,35.889a3.392,3.392,0,0,1-6.409,0L3.106,2.742A3.383,3.383,0,0,0,.3.651.33.33,0,0,1,0,.327.327.327,0,0,1,.327,0Z"
                  transform="translate(40.392 38.168) rotate(180)"
                  fill="#9A9DA7"
                />
              </svg>
              datos
            </button>
            <button
              class="botones-imagen"
              :class="{ botonActivo: pestana == 'descripcion' }"
              @click="cambiarPestana('descripcion')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="40.392" height="38.168" viewBox="0 0 40.392 38.168">
                <path
                  id="Path_401"
                  data-name="Path 401"
                  d="M3.78,1.3a4.375,4.375,0,0,1,.533.97L18.188,35.388l.017.032.017.058a2.535,2.535,0,0,0,.48.756,2.071,2.071,0,0,0,2.989,0,2.536,2.536,0,0,0,.479-.755l.008-.028,13.9-33.184a4.378,4.378,0,0,1,.533-.97H3.78M.327,0H40.065a.327.327,0,0,1,.326.327.329.329,0,0,1-.3.324,3.384,3.384,0,0,0-2.806,2.09L23.4,35.889a3.392,3.392,0,0,1-6.409,0L3.106,2.742A3.383,3.383,0,0,0,.3.651.33.33,0,0,1,0,.327.327.327,0,0,1,.327,0Z"
                  fill="#af2828"
                />
              </svg>

              descripción
            </button>
            <button
              class="botones-imagen"
              :class="{ botonActivo: pestana == 'personajes' }"
              @click="cambiarPestana('personajes')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="40.392" height="38.168" viewBox="0 0 40.392 38.168">
                <path
                  id="Path_401"
                  data-name="Path 401"
                  d="M3.78,1.3a4.375,4.375,0,0,1,.533.97L18.188,35.388l.017.032.017.058a2.535,2.535,0,0,0,.48.756,2.071,2.071,0,0,0,2.989,0,2.536,2.536,0,0,0,.479-.755l.008-.028,13.9-33.184a4.378,4.378,0,0,1,.533-.97H3.78M.327,0H40.065a.327.327,0,0,1,.326.327.329.329,0,0,1-.3.324,3.384,3.384,0,0,0-2.806,2.09L23.4,35.889a3.392,3.392,0,0,1-6.409,0L3.106,2.742A3.383,3.383,0,0,0,.3.651.33.33,0,0,1,0,.327.327.327,0,0,1,.327,0Z"
                  transform="translate(40.392 38.168) rotate(180)"
                  fill="#9A9DA7"
                />
              </svg>
              personajes y gestos
            </button>
            <button
              class="botones-imagen"
              :class="{ botonActivo: pestana == 'proyectos' }"
              @click="cambiarPestana('proyectos')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="40.392" height="38.168" viewBox="0 0 40.392 38.168">
                <path
                  id="Path_401"
                  data-name="Path 401"
                  d="M3.78,1.3a4.375,4.375,0,0,1,.533.97L18.188,35.388l.017.032.017.058a2.535,2.535,0,0,0,.48.756,2.071,2.071,0,0,0,2.989,0,2.536,2.536,0,0,0,.479-.755l.008-.028,13.9-33.184a4.378,4.378,0,0,1,.533-.97H3.78M.327,0H40.065a.327.327,0,0,1,.326.327.329.329,0,0,1-.3.324,3.384,3.384,0,0,0-2.806,2.09L23.4,35.889a3.392,3.392,0,0,1-6.409,0L3.106,2.742A3.383,3.383,0,0,0,.3.651.33.33,0,0,1,0,.327.327.327,0,0,1,.327,0Z"
                  fill="#af2828"
                />
              </svg>
              proyectos
            </button>
          </div>
          <hr class="linea-red" />
          <section class="informacion-general">
            <span v-if="pestana == 'datos'">
              <h2 class="sub-pestana">Datos</h2>
              <div class="linea">
                <div class="titulo">Título</div>
                <div class="descripcion">{{ obra.title }}</div>
              </div>
              <div class="linea">
                <div class="titulo">Autor</div>
                <nuxt-link :to="`/autor/${obra.author_id.lastname}?page=1`">
                  <div class="descripcion">{{ obra.author_id.name }} {{ obra.author_id.lastname }}</div>
                </nuxt-link>
              </div>
              <div class="linea">
                <div class="titulo">Fecha</div>
                <div class="descripcion">{{ obra.annotation_date }}</div>
              </div>
              <div class="linea">
                <div class="titulo">Tipo</div>
                <div class="descripcion">{{ obra.type_id.name }}</div>
              </div>
              <div class="linea">
                <div class="titulo">Fuente de la imagen</div>
                <div class="descripcion">{{ obra.source_id.name }}</div>
              </div>
              <div class="linea">
                <div class="titulo">Categorías</div>
                <ul class="nube-categorias">
                  <div v-for="(nombre, i) in categorias" :key="`categoria-${i}`" class="categorias">
                    <nuxt-link :to="`/categoria/${categorias[i]}?page=1`"
                      ><li>{{ categorias[i] }}</li></nuxt-link
                    >
                  </div>
                </ul>
              </div>
            </span>
            <span v-else-if="pestana == 'descripcion'">
              <h2 class="sub-pestana">Descripción</h2>
              <div class="linea">
                <div class="titulo">título ejemplo</div>
                <div class="descripcion">ejemplo de descripción lorem ipsum</div>
              </div>
              <div class="linea">
                <div class="titulo">título ejemplo</div>
                <div class="descripcion">ejemplo de descripción lorem ipsum</div>
              </div>
            </span>

            <span v-else-if="pestana == 'personajes'">
              <h2 class="sub-pestana">Personajes y gestos</h2>
              <div class="linea">
                <div class="titulo">título ejemplo</div>
                <div class="descripcion">ejemplo de descripción lorem ipsum</div>
              </div>
              <div class="linea">
                <div class="titulo">título ejemplo</div>
                <div class="descripcion">ejemplo de descripción lorem ipsum</div>
              </div>
            </span>

            <span v-else-if="pestana == 'proyectos'">
              <h2 class="sub-pestana">Proyectos</h2>
              <div class="linea">
                <div class="titulo">título ejemplo</div>
                <div class="descripcion">ejemplo de descripción lorem ipsum</div>
              </div>
              <div class="linea">
                <div class="titulo">título ejemplo</div>
                <div class="descripcion">ejemplo de descripción lorem ipsum</div>
              </div>
            </span>
          </section>
          <h2 class="sub-pestana">Ubicación</h2>
          <section class="informacion-geografica">
            <div v-if="obra.actual_country_id != null || obra.origin_country_id != null" class="galeria-mapas">
              <div class="mapa">
                <h5 class="subtitulo">País de origen</h5>
                <div class="ubicacion"></div>
                <nuxt-link :to="`/mapa/${obra.origin_country_id.name_spanish}?page=1`">
                  <h5 class="pais">{{ obra.origin_country_id.name_spanish }}</h5>
                </nuxt-link>
              </div>
              <span v-if="obra.actual_country_id != null && obra.origin_country_id != null">
                <div v-if="obra.origin_country_id.name_spanish != obra.actual_country_id.name_spanish" class="mapa">
                  <h5 class="subtitulo">País actual</h5>
                  <div class="ubicacion"></div>
                  <nuxt-link :to="`/mapa/${obra.actual_country_id.name_spanish}?page=1`">
                    <h5 class="pais">{{ obra.actual_country_id.name_spanish }}</h5>
                  </nuxt-link>
                </div>
              </span>
            </div>
          </section>
        </div>
      </div>
      <div class="galeria">
        <Galeria :obras="obras" />
      </div>
    </template>
  </div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';
import { crearHead, urlImagen } from '../../utilidades/ayudas';
import VueMagnifier from '~/components/Vue-magnifier.vue';

export default {
  components: { VueMagnifier },
  data() {
    return {
      obra: {},
      pestana: 'datos',
      categorias: [],
      obras: [],
    };
  },

  async fetch() {
    const query = gql`
      query {
        artworks(filter: { id: { _eq: ${this.$route.params.id} } }, limit: 1) {
          id
          title
          annotation_date
          latitude_current
          longitude_current
          synthesis
          image {
            id
            title
          }
          author_id {
            id
            name
            lastname
          }
          origin_country_id {
            id
            name_spanish
          }
          actual_country_id {
            id
            name_spanish
          }
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
          type_id {
            id
            name
          }
          source_id {
            id
            name
          }
        }

    categories(filter: { artworks_category_1_r: { _or: [
        { id: { _eq: ${this.$route.params.id} } }
        ]} }, limit: 100) {
          name
          artworks_category_1_r {
            id
            title
            annotation_date
            image {
              id
              title
            }
            author_id {
              id
              name
              lastname
            }
          }
        }
      }
    `;

    const { categories, artworks } = await this.$graphql.principal.request(query);

    if (artworks && artworks.length) {
      this.obra = artworks[0];
    }
    if (categories && categories.length) {
      categories.forEach((category) => {
        this.obras = category.artworks_category_1_r;
      });
    } else {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error('La página no existe');
    }

    this.agregarCategorias();
  },

  head() {
    return crearHead(
      this.$store.state.general.datos.nombre,
      this.obra.title,
      this.obra.synthesis,
      this.obra.image,
      this.$nuxt.$route.path
    );
  },

  methods: {
    urlImagen(objImg, key) {
      return objImg && objImg.id ? urlImagen(objImg.id, key) : '';
    },
    cambiarPestana(pestana) {
      this.pestana = pestana;
    },
    agregarCategorias() {
      const categorias = [];
      const cantidad = 5;
      for (let i = 0; i <= cantidad; i++) {
        const categoria = this.obra[`category_${i}_id`];
        if (categoria) {
          categorias.push(categoria.name);
        }
      }
      this.categorias = categorias;
    },
  },
};
</script>
<style lang="scss" scoped>
main {
  justify-content: center;
}
.sub-pestana {
  padding-top: 1.5em;
}

.nube-categorias {
  display: grid;
  width: 90vw;
}
.triangulo-des {
  width: 0;
  height: 0;
  border-right: 45px solid transparent;
  border-top: 45px solid $claridad;
  border-left: 45px solid $claridad;
  border-bottom: 45px solid transparent;
  position: absolute;
  top: 179px;
  left: 228px;
  opacity: 0;
}
.hover-info {
  display: flex;
  background-color: transparent;
  width: 40%;
  height: 100%;
  top: 179px;
  left: 228px;
  cursor: pointer;
  .textos-hover {
    padding-top: 5px;
    padding-left: 20px;
    .descripcion-tit {
      color: $profundidad;
      padding-bottom: 20px;
    }
    .descripcion-des {
      line-height: 1.6;
      color: $profundidad;
    }
  }
}
.logo-ar {
  margin: 20px;
}

.imagen-des {
  max-width: 60%;
  height: auto;
}

.mediana {
  width: 100%;
  height: 100vh;
  position: absolute;
  background-color: $mediana;
  z-index: -99;
}

.contenedor-centrado {
  display: flex;
  width: 100vw;
  justify-content: center;
  overflow: hidden;

  .completo-archivo {
    padding-top: 50px;
    overflow: hidden;
    width: 900px;
    padding-bottom: 50px;
  }
  .titulo {
    justify-content: flex-end;
    display: flex;
    flex-direction: column;
    text-align: start;
  }
}

hr.linea-red {
  border-top: 2px solid $dolor;
}

h5 {
  font-family: $fuenteMenu;
  font-weight: 300;
  letter-spacing: 4px;
  text-transform: uppercase;
  padding-right: 4em;
}
.nombre-autor {
  font-family: $fuenteMenu;
  font-weight: 400;
  letter-spacing: 3px;
  margin-top: 15px;
  margin-bottom: 25px;
  text-transform: uppercase;
}
.centrar-contenido {
  padding-top: 0;
}
.descripcion {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
}

img {
  display: flex;
  align-self: start;
  height: auto;
}
.botonera {
  display: flex;
  justify-content: space-around;
  .botones-imagen {
    letter-spacing: 3px;
    text-transform: uppercase;
    font-family: 'Work Sans', sans-serif;
    font-weight: 400;
    font-size: 12px;
    margin-top: 30px;
    flex-direction: column;
    display: flex;
    align-items: center;
    height: 110px;
    justify-content: flex-end;
    cursor: pointer;
    color: #9a9da7;
  }
  .botonActivo {
    color: $dolor;
  }
}
button:focus {
  outline: none;
}
.informacion-general {
  .linea {
    display: flex;
    align-items: baseline;
    height: fit-content;
    margin-top: 1.2em;
    .titulo {
      letter-spacing: 3px;
      text-transform: uppercase;
      font-family: $fuenteMenu;
      font-weight: 400;
      font-size: 12px;
      margin-top: 30px;
      color: $profundidad;
      text-align: start;
      width: 10vw;
    }
    .descripcion {
      position: relative;
      left: 80px;
      font-family: $fuentePrincipal;
      font-size: 18px;
      width: 90vw;
      margin-right: 100px;
    }
    .categorias {
      position: relative;
      left: 80px;
      font-family: $fuentePrincipal;
      font-size: 18px;
      text-transform: capitalize;
      width: 90vw;
    }
    .enlace,
    ul {
      position: relative;
      left: 0px;
      margin-right: 100px;
    }
  }
}
.informacion-geografica {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  top: 40px;
  padding-bottom: 40px;
  .titulo {
    align-self: center;
    top: 30px;
  }
  .galeria-mapas {
    display: flex;
    justify-content: space-around;
    .mapa {
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-top: 1em;
      .subtitulo {
      }
      .ubicacion {
      }
      .pais {
      }
    }
  }
}

.clasificacion {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  top: 60px;
  align-self: center;
}

.galeria {
  display: flex;
  position: relative;
  justify-content: space-around;
  align-items: center;
}
</style>
