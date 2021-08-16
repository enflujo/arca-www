<template>
  <div>
    <template v-if="$fetchState.pending">
      <h1>Pendiente...</h1>
    </template>

    <template v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </template>

    <template v-else>
      <div class="barra-izquierda">
        <div>
          <Buscador />
        </div>
        <div class="barra-texto">
          <ul>
            <div class="pantalla">
              <h3 class="seccion">Categorias</h3>
              <li>Categoría Numero X</li>
              <li>Categoría Numero X</li>
              <li>Categoría Numero X</li>
              <li>Categoría Numero X</li>
              <li>Categoría Numero X</li>
              <li>Categoría Numero X</li>
              <li>Categoría Numero X</li>
              <li>Categoría Numero X</li>
              <li>Categoría Numero X</li>
              <li>Categoría Numero X</li>
              <li>Categoría Numero X</li>
              <li>Categoría Numero X</li>
              <li>Categoría Numero X</li>
              <li>Categoría Numero X</li>
            </div>
            <div class="pantalla">
              <h3 class="seccion">Autores</h3>
              <li>Autor numero X</li>
              <li>Autor numero X</li>
              <li>Autor numero X</li>
              <li>Autor numero X</li>
              <li>Autor numero X</li>
              <li>Autor numero X</li>
              <li>Autor numero X</li>
              <li>Autor numero X</li>
              <li>Autor numero X</li>
              <li>Autor numero X</li>
            </div>
            <div class="pantalla">
              <h3 class="seccion">Regiones</h3>
              <li>Regiones numero X</li>
              <li>Regiones numero X</li>
              <li>Regiones numero X</li>
              <li>Regiones numero X</li>
              <li>Regiones numero X</li>
              <li>Regiones numero X</li>
              <li>Regiones numero X</li>
              <li>Regiones numero X</li>
              <li>Regiones numero X</li>
              <li>Regiones numero X</li>
            </div>
          </ul>
        </div>
      </div>
      <div class="archivo">
        <div class="titulo">
          <h1>{{ pagina.titulo }}</h1>
          <p>{{ pagina.descripcion }}</p>
        </div>
        <!-- <div class="imagenes">
          <div class="caja-inicial">
            <img src="imgs/4408.jpg" sizes="sm:50vw md:250vw lg:200px" />
        <div class="caja-descripcion">
        <img src="imgs/4408.jpg" sizes="sm:50vw md:250vw lg:200px" />
        <div class="descripcion">
                <h2 class="titulo-obra">Sagrado Corazon</h2>
                <h3 class="subtitulo-obra">Anonimo</h3>
                <p class="descripcion-obra">
                  Nacido en Santa Fe de Bogotá e hijo de un artesano español. Se dedicó también a la arquitectura y la
                  poesía. Personaje de la novela
                </p>
                <button class="boton-ver">VER OBRA</button>
              </div>
            </div> -->
        <!-- <img src="imgs/4408.jpg" sizes="sm:50vw md:250vw lg:200px" /> -->
        <!-- </div>
      </div> -->
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
    urlImagen(objImg, key) {
      return objImg && objImg.id ? urlImagen(objImg.id, key) : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.contenedor {
  display: flex;
  justify-content: center;
  position: absolute;
  overflow: auto;
  top: 0;
}
li {
  margin-bottom: 10px;
}
.barra-izquierda {
  background-color: $mediana;
  height: 100vh;
  width: 20vw;
  display: flex;
  padding-top: 4em;
  flex-direction: column;
  align-items: center;
  align-items: center;
  overflow-x: auto;
}
.barra-texto {
  width: 20vw;
  padding-left: 20px;
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
  .imagenes {
    width: 1100px;
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
}
.pantalla {
  margin-top: 10px;
}
ul {
  list-style: none;
  padding: 0;
  font-family: $fuenteMenu;
}
.seccion {
  margin-bottom: 10px;
  font-family: $fuenteSec;
}
</style>
