<template>
  <div>
    <template v-if="$fetchState.pending">
      <h1>Pendiente...</h1>
    </template>

    <template v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </template>

    <template v-else>
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
          </div>
          <div class="botonera">
            <button
              class="botones-imagen"
              :class="{ botonActivo: pestana == 'datos' }"
              @click="cambiarPestana('datos')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="38.294" height="36.865" viewBox="0 0 38.294 36.865">
                <path
                  id="Path_401"
                  data-name="Path 401"
                  d="M6.333,3l12.6,30.632.012.036a.684.684,0,0,0,.138.192.513.513,0,0,0,.138,0,.683.683,0,0,0,.138-.192l.011-.036L31.961,3H6.333M.31,0H37.985a.313.313,0,0,1,.309.316.316.316,0,0,1-.285.313,3.226,3.226,0,0,0-2.66,2.019L22.185,34.664a3.2,3.2,0,0,1-6.076,0L2.945,2.648A3.225,3.225,0,0,0,.284.629.316.316,0,0,1,0,.316.313.313,0,0,1,.31,0Z"
                  transform="translate(38.294 36.865) rotate(180)"
                  fill="grey"
                />
              </svg>
              <div class="texto-cat">datos</div>
            </button>
            <button
              class="botones-imagen"
              :class="{ botonActivo: pestana == 'descripcion' }"
              @click="cambiarPestana('descripcion')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="38.294" height="36.865" viewBox="0 0 38.294 36.865">
                <path
                  id="Path_401"
                  data-name="Path 401"
                  d="M6.333,3l12.6,30.632.012.036a.684.684,0,0,0,.138.192.513.513,0,0,0,.138,0,.683.683,0,0,0,.138-.192l.011-.036L31.961,3H6.333M.31,0H37.985a.313.313,0,0,1,.309.316.316.316,0,0,1-.285.313,3.226,3.226,0,0,0-2.66,2.019L22.185,34.664a3.2,3.2,0,0,1-6.076,0L2.945,2.648A3.225,3.225,0,0,0,.284.629.316.316,0,0,1,0,.316.313.313,0,0,1,.31,0Z"
                  transform="translate(38.294 36.865) rotate(180)"
                  fill="grey"
                />
              </svg>
              <div class="texto-cat">descripcion</div>
            </button>
            <button
              class="botones-imagen"
              :class="{ botonActivo: pestana == 'personajes' }"
              @click="cambiarPestana('personajes')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="38.294" height="36.865" viewBox="0 0 38.294 36.865">
                <path
                  id="Path_401"
                  data-name="Path 401"
                  d="M6.333,3l12.6,30.632.012.036a.684.684,0,0,0,.138.192.513.513,0,0,0,.138,0,.683.683,0,0,0,.138-.192l.011-.036L31.961,3H6.333M.31,0H37.985a.313.313,0,0,1,.309.316.316.316,0,0,1-.285.313,3.226,3.226,0,0,0-2.66,2.019L22.185,34.664a3.2,3.2,0,0,1-6.076,0L2.945,2.648A3.225,3.225,0,0,0,.284.629.316.316,0,0,1,0,.316.313.313,0,0,1,.31,0Z"
                  transform="translate(38.294 36.865) rotate(180)"
                  fill="grey"
                />
              </svg>
              <div class="texto-cat">personajes y gestos</div>
            </button>
            <button
              class="botones-imagen"
              :class="{ botonActivo: pestana == 'proyectos' }"
              @click="cambiarPestana('proyectos')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="38.294" height="36.865" viewBox="0 0 38.294 36.865">
                <path
                  id="Path_401"
                  data-name="Path 401"
                  d="M6.333,3l12.6,30.632.012.036a.684.684,0,0,0,.138.192.513.513,0,0,0,.138,0,.683.683,0,0,0,.138-.192l.011-.036L31.961,3H6.333M.31,0H37.985a.313.313,0,0,1,.309.316.316.316,0,0,1-.285.313,3.226,3.226,0,0,0-2.66,2.019L22.185,34.664a3.2,3.2,0,0,1-6.076,0L2.945,2.648A3.225,3.225,0,0,0,.284.629.316.316,0,0,1,0,.316.313.313,0,0,1,.31,0Z"
                  transform="translate(38.294 36.865) rotate(180)"
                  fill="grey"
                />
              </svg>
              <div class="texto-cat">proyectos</div>
            </button>
          </div>
          <hr class="linea-red" />
          <section class="informacion-general">
            <span v-if="pestana == 'datos'">
              <h1 class="sub-pestana">Datos</h1>
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
              <h1 class="sub-pestana">Descripción</h1>
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
              <h1 class="sub-pestana">Personajes y gestos</h1>
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
              <h1 class="sub-pestana">Proyectos</h1>
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
          <h1 class="sub-pestana">Ubicación</h1>
          <section class="informacion-geografica">
            <div v-if="obra.actual_country_id != null || obra.origin_country_id != null" class="galeria-mapas">
              <div class="mapa">
                <h5 class="subtitulo sinpad">País de origen</h5>
                <div class="ubicacion"></div>
                <svg xmlns="http://www.w3.org/2000/svg" width="96.785" height="91.458" viewBox="0 0 96.785 91.458">
                  <path
                    id="Path_438"
                    data-name="Path 438"
                    d="M10.62,3.957a7.95,7.95,0,0,1,.472,1.083L44.455,84.7a4.19,4.19,0,0,0,3.937,2.8,4.29,4.29,0,0,0,4.029-3.032L85.6,5.274a9.318,9.318,0,0,1,.583-1.317H10.62M.784,0H96a.783.783,0,0,1,.781.783.789.789,0,0,1-.719.778,8.109,8.109,0,0,0-6.723,5.009L56.071,86a8.128,8.128,0,0,1-15.356,0L7.442,6.569A8.107,8.107,0,0,0,.718,1.561.79.79,0,0,1,0,.783.784.784,0,0,1,.784,0Z"
                    fill="#08173e"
                  />
                </svg>
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
          <div class="galeria">
            <Galeria :obras="obras" />
          </div>
        </div>
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
  display: flex;
  flex-direction: column;
}
.sub-pestana {
  padding-top: 1.5em;
  font-size: 24px;
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

.texto-cat {
  margin-top: 8px;
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
  // display: flex;
  // align-self: start;
  // height: auto;
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
    opacity: 0.4;
  }
  .botones-imagen:hover {
    opacity: 1;
    transition: 0.7s;
  }
  .botonActivo {
    color: $dolor;
    font-weight: 600;
    opacity: 1;
    transition: 0.7s;
    #Path_401 {
      fill: $dolor;
      opacity: 1;
    }
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
      width: 200px;
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
      height: 160px;
      justify-content: space-evenly;
      .subtitulo {
        padding: 0;
      }
      .ubicacion {
      }
      .pais {
        padding: 0;
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
  position: relative;
  height: 70vh;
  margin-top: 13px;
  overflow-y: hidden;
}
</style>
