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
          <h1>{{ obra.title }}</h1>
          <h3 class="nombre-autor">
            {{ `${obra.author_id.name} ${obra.author_id.lastname}` }}
            <span class="fechas">(1640 - 1660)</span>
          </h3>
          <div class="descripcion">
            <img :src="urlImagen(obra.image)" :alt="obra.title" />
            <!-- <p>{{ obra.annotation_date }}</p> -->
          </div>
          <div class="botonera">
            <button class="botones-imagen">
              <svg
                id="Component_19_1"
                data-name="Component 19 – 1"
                xmlns="http://www.w3.org/2000/svg"
                width="62.294"
                height="58.865"
                viewBox="0 0 62.294 58.865"
              >
                <g id="Path_401" data-name="Path 401" transform="translate(62.294 58.865) rotate(180)" fill="none">
                  <path
                    d="M.462,1A5.218,5.218,0,0,1,4.79,4.228L26.206,55.35a5.232,5.232,0,0,0,9.884,0L57.5,4.228A5.219,5.219,0,0,1,61.831,1a.508.508,0,0,0,.463-.5.5.5,0,0,0-.5-.5H.5A.5.5,0,0,0,0,.5.509.509,0,0,0,.462,1Z"
                    stroke="none"
                  />
                  <path
                    d="M 5.829826354980469 1.999996185302734 C 6.316333770751953 2.678092956542969 6.563488006591797 3.262111663818359 6.651763916015625 3.495990753173828 L 28.05023956298828 54.57759857177734 L 28.07585906982422 54.62702560424805 L 28.10255432128906 54.71575164794922 C 28.13516998291016 54.80129241943359 28.35929107666016 55.35911560058594 28.84220886230469 55.88205718994141 C 29.45306015014648 56.54353713989258 30.20698928833008 56.86509704589844 31.14706993103027 56.86509704589844 C 32.08756256103516 56.86509704589844 32.84175872802734 56.54351806640625 33.4527587890625 55.88196563720703 C 33.93312072753906 55.36188125610352 34.15741729736328 54.80730819702148 34.19192123413086 54.71716690063477 L 34.20439147949219 54.67400741577148 L 55.64295196533203 3.495635986328125 C 55.73122787475586 3.261917114257812 55.97848129272461 2.677978515625 56.46494293212891 1.999996185302734 L 5.829826354980469 1.999996185302734 M 0.5046195983886719 -3.814697265625e-06 L 61.7912712097168 -3.814697265625e-06 C 62.06887817382812 -3.814697265625e-06 62.29413986206055 0.2259178161621094 62.29413986206055 0.5039558410644531 C 62.29413986206055 0.7657279968261719 62.09220123291016 0.9760284423828125 61.8313102722168 1.004398345947266 C 58.4934196472168 1.372634887695312 57.50440979003906 4.228347778320312 57.50440979003906 4.228347778320312 L 36.08946228027344 55.35034561157227 C 36.08946228027344 55.35034561157227 34.93679046630859 58.86509704589844 31.14706993103027 58.86509704589844 C 27.35823059082031 58.86509704589844 26.20555877685547 55.35034561157227 26.20555877685547 55.35034561157227 L 4.7901611328125 4.228347778320312 C 4.7901611328125 4.228347778320312 3.802040100097656 1.372634887695312 0.4623908996582031 1.004398345947266 C 0.2028083801269531 0.9760284423828125 0 0.7657279968261719 0 0.5039558410644531 C 0 0.2259178161621094 0.2261314392089844 -3.814697265625e-06 0.5046195983886719 -3.814697265625e-06 Z"
                    stroke="none"
                    fill="#af2828"
                  />
                </g>
              </svg>
              datos
            </button>
            <button class="botones-imagen">
              <svg
                id="Component_21_1"
                data-name="Component 21 – 1"
                xmlns="http://www.w3.org/2000/svg"
                width="62.294"
                height="58.865"
                viewBox="0 0 62.294 58.865"
              >
                <g id="Path_438" data-name="Path 438" fill="none" opacity="0.396">
                  <path
                    d="M.462,1A5.218,5.218,0,0,1,4.79,4.228L26.206,55.35a5.232,5.232,0,0,0,9.884,0L57.5,4.228A5.219,5.219,0,0,1,61.831,1a.508.508,0,0,0,.463-.5.5.5,0,0,0-.5-.5H.5A.5.5,0,0,0,0,.5.509.509,0,0,0,.462,1Z"
                    stroke="none"
                  />
                  <path
                    d="M 5.829826354980469 1.999996185302734 C 6.316333770751953 2.678092956542969 6.563488006591797 3.262111663818359 6.651763916015625 3.495990753173828 L 28.05023956298828 54.57759857177734 L 28.07585906982422 54.62702560424805 L 28.10255432128906 54.71575164794922 C 28.13516998291016 54.80129241943359 28.35929107666016 55.35911560058594 28.84220886230469 55.88205718994141 C 29.45306015014648 56.54353713989258 30.20698928833008 56.86509704589844 31.14706993103027 56.86509704589844 C 32.08756256103516 56.86509704589844 32.84175872802734 56.54351806640625 33.4527587890625 55.88196563720703 C 33.93312072753906 55.36188125610352 34.15741729736328 54.80730819702148 34.19192123413086 54.71716690063477 L 34.20439147949219 54.67400741577148 L 55.64295196533203 3.495635986328125 C 55.73122787475586 3.261917114257812 55.97848129272461 2.677978515625 56.46494293212891 1.999996185302734 L 5.829826354980469 1.999996185302734 M 0.5046195983886719 -3.814697265625e-06 L 61.7912712097168 -3.814697265625e-06 C 62.06887817382812 -3.814697265625e-06 62.29413986206055 0.2259178161621094 62.29413986206055 0.5039558410644531 C 62.29413986206055 0.7657279968261719 62.09220123291016 0.9760284423828125 61.8313102722168 1.004398345947266 C 58.4934196472168 1.372634887695312 57.50440979003906 4.228347778320312 57.50440979003906 4.228347778320312 L 36.08946228027344 55.35034561157227 C 36.08946228027344 55.35034561157227 34.93679046630859 58.86509704589844 31.14706993103027 58.86509704589844 C 27.35823059082031 58.86509704589844 26.20555877685547 55.35034561157227 26.20555877685547 55.35034561157227 L 4.7901611328125 4.228347778320312 C 4.7901611328125 4.228347778320312 3.802040100097656 1.372634887695312 0.4623908996582031 1.004398345947266 C 0.2028083801269531 0.9760284423828125 0 0.7657279968261719 0 0.5039558410644531 C 0 0.2259178161621094 0.2261314392089844 -3.814697265625e-06 0.5046195983886719 -3.814697265625e-06 Z"
                    stroke="none"
                    fill="#08173e"
                  />
                </g>
              </svg>
              descripcion
            </button>
            <button class="botones-imagen">
              <svg
                id="Component_20_1"
                data-name="Component 20 – 1"
                xmlns="http://www.w3.org/2000/svg"
                width="62.294"
                height="58.865"
                viewBox="0 0 62.294 58.865"
              >
                <g
                  id="Path_439"
                  data-name="Path 439"
                  transform="translate(62.294 58.865) rotate(180)"
                  fill="none"
                  opacity="0.396"
                >
                  <path
                    d="M.462,1A5.218,5.218,0,0,1,4.79,4.228L26.206,55.35a5.232,5.232,0,0,0,9.884,0L57.5,4.228A5.219,5.219,0,0,1,61.831,1a.508.508,0,0,0,.463-.5.5.5,0,0,0-.5-.5H.5A.5.5,0,0,0,0,.5.509.509,0,0,0,.462,1Z"
                    stroke="none"
                  />
                  <path
                    d="M 5.829826354980469 1.999996185302734 C 6.316333770751953 2.678092956542969 6.563488006591797 3.262111663818359 6.651763916015625 3.495990753173828 L 28.05023956298828 54.57759857177734 L 28.07585906982422 54.62702560424805 L 28.10255432128906 54.71575164794922 C 28.13516998291016 54.80129241943359 28.35929107666016 55.35911560058594 28.84220886230469 55.88205718994141 C 29.45306015014648 56.54353713989258 30.20698928833008 56.86509704589844 31.14706993103027 56.86509704589844 C 32.08756256103516 56.86509704589844 32.84175872802734 56.54351806640625 33.4527587890625 55.88196563720703 C 33.93312072753906 55.36188125610352 34.15741729736328 54.80730819702148 34.19192123413086 54.71716690063477 L 34.20439147949219 54.67400741577148 L 55.64295196533203 3.495635986328125 C 55.73122787475586 3.261917114257812 55.97848129272461 2.677978515625 56.46494293212891 1.999996185302734 L 5.829826354980469 1.999996185302734 M 0.5046195983886719 -3.814697265625e-06 L 61.7912712097168 -3.814697265625e-06 C 62.06887817382812 -3.814697265625e-06 62.29413986206055 0.2259178161621094 62.29413986206055 0.5039558410644531 C 62.29413986206055 0.7657279968261719 62.09220123291016 0.9760284423828125 61.8313102722168 1.004398345947266 C 58.4934196472168 1.372634887695312 57.50440979003906 4.228347778320312 57.50440979003906 4.228347778320312 L 36.08946228027344 55.35034561157227 C 36.08946228027344 55.35034561157227 34.93679046630859 58.86509704589844 31.14706993103027 58.86509704589844 C 27.35823059082031 58.86509704589844 26.20555877685547 55.35034561157227 26.20555877685547 55.35034561157227 L 4.7901611328125 4.228347778320312 C 4.7901611328125 4.228347778320312 3.802040100097656 1.372634887695312 0.4623908996582031 1.004398345947266 C 0.2028083801269531 0.9760284423828125 0 0.7657279968261719 0 0.5039558410644531 C 0 0.2259178161621094 0.2261314392089844 -3.814697265625e-06 0.5046195983886719 -3.814697265625e-06 Z"
                    stroke="none"
                    fill="#08173e"
                  />
                </g>
              </svg>
              personajes y gestos
            </button>
            <button class="botones-imagen">
              <svg
                id="Component_21_1"
                data-name="Component 21 – 1"
                xmlns="http://www.w3.org/2000/svg"
                width="62.294"
                height="58.865"
                viewBox="0 0 62.294 58.865"
              >
                <g id="Path_438" data-name="Path 438" fill="none" opacity="0.396">
                  <path
                    d="M.462,1A5.218,5.218,0,0,1,4.79,4.228L26.206,55.35a5.232,5.232,0,0,0,9.884,0L57.5,4.228A5.219,5.219,0,0,1,61.831,1a.508.508,0,0,0,.463-.5.5.5,0,0,0-.5-.5H.5A.5.5,0,0,0,0,.5.509.509,0,0,0,.462,1Z"
                    stroke="none"
                  />
                  <path
                    d="M 5.829826354980469 1.999996185302734 C 6.316333770751953 2.678092956542969 6.563488006591797 3.262111663818359 6.651763916015625 3.495990753173828 L 28.05023956298828 54.57759857177734 L 28.07585906982422 54.62702560424805 L 28.10255432128906 54.71575164794922 C 28.13516998291016 54.80129241943359 28.35929107666016 55.35911560058594 28.84220886230469 55.88205718994141 C 29.45306015014648 56.54353713989258 30.20698928833008 56.86509704589844 31.14706993103027 56.86509704589844 C 32.08756256103516 56.86509704589844 32.84175872802734 56.54351806640625 33.4527587890625 55.88196563720703 C 33.93312072753906 55.36188125610352 34.15741729736328 54.80730819702148 34.19192123413086 54.71716690063477 L 34.20439147949219 54.67400741577148 L 55.64295196533203 3.495635986328125 C 55.73122787475586 3.261917114257812 55.97848129272461 2.677978515625 56.46494293212891 1.999996185302734 L 5.829826354980469 1.999996185302734 M 0.5046195983886719 -3.814697265625e-06 L 61.7912712097168 -3.814697265625e-06 C 62.06887817382812 -3.814697265625e-06 62.29413986206055 0.2259178161621094 62.29413986206055 0.5039558410644531 C 62.29413986206055 0.7657279968261719 62.09220123291016 0.9760284423828125 61.8313102722168 1.004398345947266 C 58.4934196472168 1.372634887695312 57.50440979003906 4.228347778320312 57.50440979003906 4.228347778320312 L 36.08946228027344 55.35034561157227 C 36.08946228027344 55.35034561157227 34.93679046630859 58.86509704589844 31.14706993103027 58.86509704589844 C 27.35823059082031 58.86509704589844 26.20555877685547 55.35034561157227 26.20555877685547 55.35034561157227 L 4.7901611328125 4.228347778320312 C 4.7901611328125 4.228347778320312 3.802040100097656 1.372634887695312 0.4623908996582031 1.004398345947266 C 0.2028083801269531 0.9760284423828125 0 0.7657279968261719 0 0.5039558410644531 C 0 0.2259178161621094 0.2261314392089844 -3.814697265625e-06 0.5046195983886719 -3.814697265625e-06 Z"
                    stroke="none"
                    fill="#08173e"
                  />
                </g>
              </svg>
              proyectos
            </button>
          </div>
          <section class="informacion-general">
            <div class="linea">
              <div class="titulo">titulo</div>
              <div class="descripcion">ejemplo de descripcion lorem ipsum</div>
            </div>
            <div class="linea">
              <div class="titulo">autor</div>
              <div class="descripcion">ejemplo de descripcion lorem ipsum</div>
            </div>
            <div class="linea">
              <div class="titulo">actividad</div>
              <div class="descripcion">ejemplo de descripcion lorem ipsum</div>
            </div>
            <div class="linea">
              <div class="titulo">tecnica</div>
              <div class="descripcion">ejemplo de descripcion lorem ipsum</div>
            </div>
            <div class="linea">
              <div class="titulo">ubicacion</div>
              <div class="descripcion">ejemplo de descripcion lorem ipsum</div>
            </div>
          </section>
          <section class="informacion-geografica">
            <div class="titulo agrandado">ubicacion</div>
            <div class="galeria-mapas">
              <div class="mapa">
                <h5 class="subtitulo">pais de origen</h5>
                <div class="ubicacion"></div>
                <h5 class="pais">mexico</h5>
              </div>
              <div class="mapa">
                <h5 class="subtitulo">ciudad de origen</h5>
                <div class="ubicacion"></div>
                <h5 class="pais">mexico</h5>
              </div>
              <div class="mapa">
                <h5 class="subtitulo">pais de pais actual</h5>
                <div class="ubicacion"></div>
                <h5 class="pais">mexico</h5>
              </div>
            </div>
          </section>
          <section class="clasificacion">
            <h3 class="titulo agrandado">clasificacion</h3>
            <h3 class="titulo agrandado">descriptores</h3>
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
  },
};
</script>
<style lang="scss" scoped>
main {
  // flex-grow: initial;
}

.contenedor-centrado {
  display: flex;
  width: 100vw;
  justify-content: center;
  .completo-archivo {
    padding-top: 100px;
    overflow: hidden;
    width: 1100px;
    padding-bottom: 100px;
  }
}

h5 {
  font-family: $fuenteMenu;
  font-weight: 300;
  letter-spacing: 4px;
  text-transform: uppercase;
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
    height: 100px;
    justify-content: space-evenly;
  }
}
.informacion-general {
  .linea {
    display: flex;
    align-items: flex-end;
    .descripcion {
      position: relative;
      left: 80px;
      font-family: $fuenteSec;
      font-size: 18px;
      text-transform: capitalize;
    }
  }
}
.titulo {
  letter-spacing: 3px;
  text-transform: uppercase;
  font-family: $fuenteMenu;
  font-weight: 400;
  font-size: 12px;
  margin-top: 30px;
  color: $profundidad;
  width: 200px;
}
.agrandado {
  font-size: 15px;
  text-align: center;
  align-self: center;
}
.informacion-geografica {
  display: flex;
  flex-direction: column;
  position: relative;
  top: 40px;
  width: 100%;
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
