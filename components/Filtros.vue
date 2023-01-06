<script>
// import { gql } from 'nuxt-graphql-request';

// export default {
//   name: 'SeccionFiltros',
//   data() {
//     return {
//       paises: [],
//       autores: [],
//     };
//   },

//   async fetch() {
//     const query = gql`
//       query {
//         countries {
//           id
//           name_spanish
//         }
//         authors {
//           id
//           lastname
//           name
//         }
//       }
//     `;

//     const { countries, authors } = await this.$graphql.principal.request(query);

//     if (countries && countries.length) {
//       this.paises = countries.sort((a, b) => {
//         const nombreA = a.name_spanish;
//         const nombreB = b.name_spanish;

//         if (nombreA < nombreB) {
//           return -1;
//         }
//         if (nombreA > nombreB) {
//           return 1;
//         }
//         return 0;
//       });
//     } else {
//       if (process.server) {
//         this.$nuxt.context.res.statusCode = 404;
//       }
//       throw new Error('La página no existe');
//     }
//     if (authors && authors.length) {
//       this.autores = authors.sort((a, b) => {
//         const apellidoA = a.lastname;
//         const apellidoB = b.lastname;

//         if (apellidoA < apellidoB) {
//           return -1;
//         }
//         if (apellidoA > apellidoB) {
//           return 1;
//         }
//         return 0;
//       });
//     }
//   },

//   computed: {
//     filtro() {
//       return this.$store.state.general.filtro;
//     },
//   },

//   methods: {
//     buscarPais(id) {
//       this.$store.dispatch('buscador/buscar', {
//         campo: 'actual_country_id',
//         comparacion: id,
//       });
//     },

//     buscarAutor(id) {
//       this.$store.dispatch('buscador/buscar', {
//         campo: 'author_id',
//         comparacion: id,
//       });
//     },

//     actualizarFiltro(filtro) {
//       this.$store.commit('general/actualizarFiltro', filtro);
//     },
//   },
// };
</script>

<template>
  <!-- <div class="contenedor-general">
    <div class="segundo-cuadro">
      <div class="botones">
        <button class="boton-filtro" @click="actualizarFiltro('pais')">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="30.239" viewBox="0 0 32 30.239">
            <g id="Path_405" data-name="Path 405" transform="translate(32 30.239) rotate(180)" fill="none">
              <path
                d="M.238.516A2.68,2.68,0,0,1,2.461,2.172l11,26.261a2.687,2.687,0,0,0,5.077,0l11-26.261A2.681,2.681,0,0,1,31.762.516.261.261,0,0,0,32,.259.259.259,0,0,0,31.742,0H.259A.259.259,0,0,0,0,.259.261.261,0,0,0,.238.516Z"
                stroke="none"
              />
              <path
                d="M 6.060083389282227 2.999996185302734 L 16.00022506713867 26.72873878479004 L 25.94016075134277 2.999996185302734 L 6.060083389282227 2.999996185302734 M 0.2592182159423828 -3.814697265625e-06 L 31.74167823791504 -3.814697265625e-06 C 31.8842887878418 -3.814697265625e-06 32 0.1160469055175781 32 0.2588768005371094 C 32 0.3933467864990234 31.89626884460449 0.5013771057128906 31.76224899291992 0.5159568786621094 C 30.04759979248047 0.7051162719726562 29.53955841064453 2.172067642211914 29.53955841064453 2.172067642211914 L 18.53886795043945 28.43305778503418 C 18.53886795043945 28.43305778503418 17.94674873352051 30.23855781555176 15.99999904632568 30.23855781555176 C 14.0536994934082 30.23855781555176 13.46158981323242 28.43305778503418 13.46158981323242 28.43305778503418 L 2.460668563842773 2.172067642211914 C 2.460668563842773 2.172067642211914 1.953079223632812 0.7051162719726562 0.237518310546875 0.5159568786621094 C 0.1041889190673828 0.5013771057128906 -1.9073486328125e-06 0.3933467864990234 -1.9073486328125e-06 0.2588768005371094 C -1.9073486328125e-06 0.1160469055175781 0.1161594390869141 -3.814697265625e-06 0.2592182159423828 -3.814697265625e-06 Z"
                stroke="none"
                fill="#08173e"
              />
            </g>
          </svg>
        </button>
        <button class="boton-filtro" @click="actualizarFiltro('autor')">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="30.239" viewBox="0 0 32 30.239">
            <g id="Path_405" data-name="Path 405" transform="translate(32 30.239) rotate(180)" fill="none">
              <path
                d="M.238.516A2.68,2.68,0,0,1,2.461,2.172l11,26.261a2.687,2.687,0,0,0,5.077,0l11-26.261A2.681,2.681,0,0,1,31.762.516.261.261,0,0,0,32,.259.259.259,0,0,0,31.742,0H.259A.259.259,0,0,0,0,.259.261.261,0,0,0,.238.516Z"
                stroke="none"
              />
              <path
                d="M 6.060083389282227 2.999996185302734 L 16.00022506713867 26.72873878479004 L 25.94016075134277 2.999996185302734 L 6.060083389282227 2.999996185302734 M 0.2592182159423828 -3.814697265625e-06 L 31.74167823791504 -3.814697265625e-06 C 31.8842887878418 -3.814697265625e-06 32 0.1160469055175781 32 0.2588768005371094 C 32 0.3933467864990234 31.89626884460449 0.5013771057128906 31.76224899291992 0.5159568786621094 C 30.04759979248047 0.7051162719726562 29.53955841064453 2.172067642211914 29.53955841064453 2.172067642211914 L 18.53886795043945 28.43305778503418 C 18.53886795043945 28.43305778503418 17.94674873352051 30.23855781555176 15.99999904632568 30.23855781555176 C 14.0536994934082 30.23855781555176 13.46158981323242 28.43305778503418 13.46158981323242 28.43305778503418 L 2.460668563842773 2.172067642211914 C 2.460668563842773 2.172067642211914 1.953079223632812 0.7051162719726562 0.237518310546875 0.5159568786621094 C 0.1041889190673828 0.5013771057128906 -1.9073486328125e-06 0.3933467864990234 -1.9073486328125e-06 0.2588768005371094 C -1.9073486328125e-06 0.1160469055175781 0.1161594390869141 -3.814697265625e-06 0.2592182159423828 -3.814697265625e-06 Z"
                stroke="none"
                fill="#08173e"
              />
            </g>
          </svg>
        </button>
      </div>
      <div v-if="filtro === 'pais'" class="lista-paises">
        <h3 v-for="(pais, i) in paises" :key="`pais-${i}`" class="nombre-pais" @click="buscarPais(pais.id)">
          {{ pais.name_spanish }}
        </h3>
      </div>

      <div v-if="filtro === 'autor'" class="lista-paises">
        <h3 v-for="(autor, i) in autores" :key="`autor-${i}`" class="nombre-pais" @click="buscarAutor(autor.id)">
          {{ autor.lastname }} {{ autor.name }}
        </h3>
      </div>
    </div>
  </div> -->
</template>

<style lang="scss" scoped>
.contenedor-general {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  .segundo-cuadro {
    width: 25vw;
    height: 30vh;
    z-index: 4;
    display: block;
    position: absolute;
    top: 10%;
    left: 25vw;
    overflow-y: auto;
    .botones {
      display: flex;
      justify-content: space-around;
    }
  }
  .buscador {
    left: 10%;
    margin: 8%;
  }

  .boton-filtro {
    display: flex;
    width: 30%;
    position: relative;
    justify-content: space-around;
    color: $profundidad;
  }

  .lista-paises {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
    top: 30px;
    position: relative;
    padding-bottom: 80px;
  }

  .nombre-pais {
    margin: 20px;
    cursor: pointer;
  }
}

.transparencia {
  opacity: 0.4;
  display: block;
  top: 0px;
  position: absolute;
}
</style>
