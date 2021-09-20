<template>
  <div>
    <template v-if="$fetchState.pending">
      <h1>Pendiente...</h1>
    </template>

    <template v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </template>

    <template v-else>
      <div class="contenedor-centrado">
        <div class="completo-archivo">
          <div class="titulo">
            <h1>{{ obra.title }}</h1>
            <h3 class="nombre-autor">{{ `${obra.author_id.name} ${obra.author_id.lastname}` }}</h3>
          </div>
          <div class="descripcion">
            <img :src="urlImagen(obra.image)" :alt="obra.title" />
            <!-- <p>{{ obra.annotation_date }}</p> -->
          </div>
          <div class="botonera">
            <button class="botones-imagen" @click="cambiarPestana('datos')">datos</button>
            <button class="botones-imagen" @click="cambiarPestana('descripcion')">descripcion</button>
            <button class="botones-imagen" @click="cambiarPestana('personajes')">personajes y gestos</button>
            <button class="botones-imagen" @click="cambiarPestana('proyectos')">proyectos</button>
          </div>
          <section class="informacion-general">
            <span v-if="this.pestana == 'datos'">
              <!-- Los títulos deberian venir de las bases de datos tambien. -->
              <div class="linea">
                <div class="titulo">Título</div>
                <div class="descripcion">{{ obra.title }}</div>
              </div>
              <div class="linea">
                <div class="titulo">Autor</div>
                <nuxt-link :to="`/archivo/${obra.author_id.lastname}`">
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
                <ul>
                  <div v-for="(nombre, i) in categorias" :key="`categoria-${i}`" class="categorias">
                    <li>{{ categorias[i] }}</li>
                  </div>
                </ul>
              </div>
            </span>
            <span v-else-if="this.pestana == 'descripcion'">
              Descripción
              <div class="linea">
                <div class="titulo">titulo ejemplo</div>
                <div class="descripcion">ejemplo de descripcion lorem ipsum</div>
              </div>
              <div class="linea">
                <div class="titulo">titulo ejemplo</div>
                <div class="descripcion">ejemplo de descripcion lorem ipsum</div>
              </div>
            </span>

            <span v-else-if="this.pestana == 'personajes'">
              Personajes y gestos
              <div class="linea">
                <div class="titulo">titulo ejemplo</div>
                <div class="descripcion">ejemplo de descripcion lorem ipsum</div>
              </div>
              <div class="linea">
                <div class="titulo">titulo ejemplo</div>
                <div class="descripcion">ejemplo de descripcion lorem ipsum</div>
              </div>
            </span>

            <span v-else-if="this.pestana == 'proyectos'">
              Proyectos
              <div class="linea">
                <div class="titulo">titulo ejemplo</div>
                <div class="descripcion">ejemplo de descripcion lorem ipsum</div>
              </div>
              <div class="linea">
                <div class="titulo">titulo ejemplo</div>
                <div class="descripcion">ejemplo de descripcion lorem ipsum</div>
              </div>
            </span>
          </section>
          <!-- TODO: Revisar la lógica y no buscar en el objeto para optimizar ¿?-->
          <section class="informacion-geografica">
            <h3 class="titulo">Ubicación</h3>
            <div v-if="obra.actual_country_id != null || obra.origin_country_id != null" class="galeria-mapas">
              <div class="mapa">
                <h5 class="subtitulo">País de origen</h5>
                <div class="ubicacion"></div>
                <nuxt-link :to="`/mapa/${obra.origin_country_id.name_spanish}`">
                  <h5 class="pais">{{ obra.origin_country_id.name_spanish }}</h5>
                </nuxt-link>
              </div>
              <span v-if="obra.actual_country_id != null && obra.origin_country_id != null">
                <div class="mapa" v-if="obra.origin_country_id.name_spanish != obra.actual_country_id.name_spanish">
                  <h5 class="subtitulo">País actual</h5>
                  <div class="ubicacion"></div>
                  <nuxt-link :to="`/mapa/${obra.actual_country_id.name_spanish}`">
                    <h5 class="pais">{{ obra.actual_country_id.name_spanish }}</h5>
                  </nuxt-link>
                </div>
              </span>
            </div>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';
import { crearHead, urlImagen } from '../../utilidades/ayudas';

export default {
  data() {
    return {
      obra: {},
      pestana: 'datos',
      categorias: [],
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
      }
    `;

    const { artworks } = await this.$graphql.principal.request(query);

    if (artworks && artworks.length) {
      this.obra = artworks[0];
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
      console.log(pestana);
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

.contenedor-centrado {
  display: flex;
  width: 100vw;
  justify-content: center;
  overflow: hidden;

  .completo-archivo {
    padding-top: 100px;
    overflow: hidden;
    width: 1100px;
    padding-bottom: 100px;
  }
  .titulo {
    justify-content: center;
    display: grid;
    text-align: center;
  }
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
  margin-top: 10px;
  margin-bottom: 10px;
  text-transform: uppercase;
}
.centrar-contenido {
  padding-top: 0;
}
.descripcion {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

img {
  width: 40%;
  display: flex;
  align-self: center;
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
    justify-content: space-evenly;
    cursor: pointer;
  }
}
.informacion-general {
  .linea {
    display: flex;
    align-items: flex-end;
    height: fit-content;
    margin-top: 0.8em;
    .titulo {
      letter-spacing: 3px;
      text-transform: uppercase;
      font-family: $fuenteMenu;
      font-weight: 400;
      font-size: 12px;
      margin-top: 30px;
      color: $profundidad;
      text-align: center;
      width: 10vw;
    }
    .descripcion {
      position: relative;
      left: 80px;
      font-family: $fuenteSec;
      font-size: 18px;
      text-transform: capitalize;
      width: 90vw;
    }
    .categorias {
      position: relative;
      left: 80px;
      font-family: $fuenteSec;
      font-size: 18px;
      text-transform: capitalize;
      width: 90vw;
    }
  }
}
.informacion-geografica {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  top: 40px;
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
</style>
