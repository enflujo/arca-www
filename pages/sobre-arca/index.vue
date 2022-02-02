<template>
  <div>
    <template v-if="$fetchState.pending">
      <div class="loading-contenedor-completo">
        <Logo class="svgDolor opac" />
        <div class="loading">
          <div class="loading-text">
            <span class="loading-text-words">A</span>
            <span class="loading-text-words">R</span>
            <span class="loading-text-words">C</span>
            <span class="loading-text-words">A</span>
          </div>
        </div>
      </div>
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
                El proyecto Arca se ensambla a partir de la necesidad de establecer una geografía de los temas de las
                representaciones visuales que surgieron en América colonial. Su elaboración proviene de una pregunta
                central ¿qué se pintó en América colonial y cuáles son los temas propios a cada región?
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
                El propósito ha sido reunir toda la producción visual conocida y disponible, de manera que se pueda
                tener una visión de conjunto de los temas, sus diferencias gestuales, las similitudes en el tratamiento,
                etc. Para el efecto se han reunido imágenes que provienen principalmente de pintura en sus diferentes
                soportes, y eventualmente objetos, techos y mural, debida su importancia. El criterio temporal cubre
                desde las tempranas imágenes del siglo XVI hasta la década de 1830, cuando se comienza a agotar, aunque
                no exclusivamente, la tradición colonial.
              </p>
            </div>
          </div>
          <div class="primera-parte">
            <div class="plantilla-texto">
              <h2 class="subtitulo-importante">ESPACIO</h2>
              <p class="descripcion-importante">
                Se ha tratado de cubrir toda América, de modo que se pueda tener un acercamiento no sólo a los temas,
                sino también a los desiguales volúmenes de producción en cada región. Cada tema ha sido clasificado en
                varias categorías, la mayoría de ellas tomadas de la tradición barroca, de modo que se pueda
                georreferenciar los datos.
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
                Como se trata de observar el conjunto de los temas, muchas de estas imágenes no tienen una calidad que
                permita apreciar sus detalles, pero sí al menos la calidad de la composición. La diversidad de fuentes
                de donde se han tomado, genera problemas con la autoría, la datación y hasta el mismo título de la obra.
                Cualquier pregunta, observación, sugerencia o corrección, será bienvenida.
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
    const { paginas, obra } = await this.$graphql.principal.request(query);
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
@use "sass:math";

.loading-contenedor-completo {
  width: 100vw;
  position: relative;
  padding-left: 620px;
  padding-right: 620px;
  padding-top: 250px;
  padding-bottom: 250px;
  height: calc(100vh - 120px);
}
.svgDolor {
  fill: $dolor;
}
// .opac {
//   animation: opacidad 2s infinite;
// }
// @keyframes opacidad {
//   0% {
//     opacity: 0;
//   }
//   50% {
//     opacity: 1;
//   }
//   100% {
//     opacity: 0;
//   }
// }
.loading-text {
  height: 100px;
  text-align: center;
  span {
    display: inline-block;
    margin: 0 5px;
    color: $dolor;
    font-size: 32px;
    font-family: $fuentePrincipal;
    @for $i from 0 through 6 {
      &:nth-child(#{$i + 1}) {
        filter: blur(0px);
        animation: blur-text 1.5s (#{math.div($i, 5)}) + s infinite linear alternate;
      }
    }
  }
}

@keyframes blur-text {
  0% {
    filter: blur(0px);
  }
  100% {
    filter: blur(4px);
  }
}
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
  font-family: 'Work Sans';
  text-align: left;
  width: 80%;
  margin-top: 4em;
  margin-bottom: 4em;
  left: 10%;
  position: relative;
}
</style>
