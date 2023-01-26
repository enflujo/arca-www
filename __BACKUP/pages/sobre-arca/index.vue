<template>
  <div>
    <template v-if="$fetchState.pending">
      <Cargador />
    </template>

    <template v-else-if="$fetchState.error">
      <h1 class="error">{{ $fetchState.error.message }}</h1>
    </template>

    <template v-else>
      <main id="main2" role="main">
        <div class="descripcion">
          <h1 class="titulo-informacion">{{ pagina.titulo }}</h1>
          <div class="linea">
            <div class="parte"></div>
            <div class="parte"></div>
          </div>
          <br />
          <!-- eslint-disable vue/no-v-html -->
          <div class="primera-parte">
            <div class="plantilla-texto">
              <h2 class="subtitulo-importante">Proyecto</h2>
              <p class="descripcion-importante">
                {{ informacion.proyecto }}
              </p>
            </div>
            <div class="pequena-galeria">
              <div class="imagen-horizontal">
                <img :src="urlImagen(obras[0].imagen)" :alt="obras.title" />
              </div>
            </div>
          </div>
          <div class="primera-parte">
            <div class="pequena-galeria">
              <div class="imagen-horizontal">
                <img :src="urlImagen(obras[1].imagen)" :alt="obras.title" />
              </div>
            </div>
            <div class="plantilla-texto">
              <h2 class="subtitulo-importante izquierda">Propósito</h2>
              <p class="descripcion-importante izquierda">
                {{ informacion.proposito }}
              </p>
            </div>
          </div>
          <div class="primera-parte">
            <div class="plantilla-texto">
              <h2 class="subtitulo-importante">Espacio</h2>
              <p class="descripcion-importante">
                {{ informacion.espacio }}
              </p>
            </div>
            <div class="pequena-galeria">
              <div class="imagen-horizontal">
                <img :src="urlImagen(obras[2].imagen)" :alt="obras.title" />
              </div>
            </div>
          </div>
          <div class="primera-parte">
            <div class="pequena-galeria">
              <div class="imagen-horizontal">
                <img :src="urlImagen(obras[3].imagen)" :alt="obras.title" />
              </div>
            </div>
            <div class="plantilla-texto">
              <h2 class="subtitulo-importante izquierda">El conjunto</h2>
              <p class="descripcion-importante izquierda">
                {{ informacion.conjunto }}
              </p>
            </div>
          </div>
          <!-- <span class="texto-descripcion" v-html="pagina.contenido">{{ pagina.contenido }}</span> -->
          <!--eslint-enable-->
        </div>
      </main>
    </template>
  </div>
</template>

<script>
import { gql } from 'nuxt-graphql-request';
import { crearHead, urlImagen } from '../../utilidades/ayudas';

export default {
  data() {
    return {
      pagina: {},
      obras: [],
      informacion: {},
    };
  },
  async fetch() {
    const query = gql`
      query {
        paginas(filter: { slug: { _eq: "sobre-arca" } }, limit: 1) {
          titulo
          slug
          descripcion
          contenido
          banner {
            id
            title
          }
        }
        general {
          proyecto
          proposito
          espacio
          conjunto
        }
        obra(filter: { clasificacion: { categorias_lista_id: { nombre: { _eq: "Advocaciones" } } } }, limit: 4) {
          arca_id
          titulo
          clasificacion {
            categorias_lista_id {
              nombre
            }
          }
          imagen {
            id
            title
          }
        }
      }
    `;
    const { paginas, general, obra } = await this.$graphql.principal.request(query);
    if (paginas.length && paginas[0].slug) {
      this.pagina = paginas[0];
    } else {
      if (process.server) {
        this.$nuxt.context.res.statusCode = 404;
      }
      throw new Error('La página no existe');
    }
    if (obra && obra.length) {
      this.obras = obra;
    }
    if (general) {
      this.informacion = general;
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
  methods: {
    urlImagen(objImg, key) {
      return objImg && objImg.id ? urlImagen(objImg.id, key) : '';
    },
  },
};
</script>

<style lang="scss" scoped>
#main2 {
  display: flex;
  justify-content: center;
}
.main {
  display: flex;
}
.linea {
  display: flex;
  justify-content: center;
  width: 100%;
  .parte {
    background-color: $dolor;
    height: 2px;
    width: 15%;
    margin-left: 40px;
    margin-right: 40px;
    margin-top: 20px;
  }
}
.titulo-informacion {
  display: flex;
  justify-content: center;
  text-align: center;
  color: $dolor;
  // border-bottom: 1px solid $dolor;
  padding-bottom: 15px;
}
.plantilla-texto {
  height: calc(100vh - 120px);
  display: flex;
  width: 50%;
  flex-direction: column;
  justify-content: center;
}
.primera-parte {
  display: flex;
  flex-direction: row;
}
.izquierda {
  position: relative;
  left: 20%;
}
.subtitulo-importante {
  letter-spacing: 4px;
  text-transform: uppercase;
  font-weight: 400;
  color: $dolor;
  font-size: 20px;
}
.descripcion-importante {
  padding-top: 10px;
  width: 80%;
  line-height: 26px;
}
.pequena-galeria {
  background-color: $dolor;
  width: 50%;
  height: 450px;
  border-radius: 10px;
  align-self: center;
  overflow: hidden;
  .imagen-horizontal {
    img {
      object-fit: contain !important;
      width: 100%;
    }
  }
}
.descripcion {
  font-family: $fuentePrincipal;
  text-align: left;
  width: 80%;
  margin-top: 4em;
  margin-bottom: 4em;
  left: 10%;
  position: relative;
}
</style>
