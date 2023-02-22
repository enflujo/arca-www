<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { extraerPrimeraLetra, gql } from '~~/utilidades/ayudas';

const cerebroArchivo = usarArchivo();
const inicialSeleccionada = ref('');
const autores = ref(null);
const inicialesAutores = new Set();

const opciones = [
  { nombre: 'Autores', slug: 'autores', iniciales: inicialesAutores },
  { nombre: 'Categorías', slug: 'categorias' },
  { nombre: 'Escenarios', slug: 'escenarios' },
  { nombre: 'Técnicas', slug: 'tecnicas' },
  { nombre: 'Donantes', slug: 'donantes' },
  { nombre: 'Ubicaciones', slug: 'ubicaciones' },
  { nombre: 'Relatos Visuales', slug: 'relatos-visuales' },
  { nombre: 'Descriptores', slug: 'descriptores' },
  { nombre: 'Objetos', slug: 'objetos' },
  { nombre: 'Gestos', slug: 'gestos' },
  { nombre: 'Cartela - Filacteria', slug: 'cartela-filacteria' },
  { nombre: 'Símbolos', slug: 'simbolos' },
  { nombre: 'Características Particulares', slug: 'caracteristicas-particulares' },
  { nombre: 'Fisiognómica', slug: 'fisiognomica' },
  { nombre: 'Fisiognómica Imagen', slug: 'fisiognomica-imagen' },
  { nombre: 'Personajes', slug: 'personajes' },
  { nombre: 'Rostros', slug: 'rostros' },
];

const paginaActual = computed(() => cerebroArchivo.paginaActual);

const ArchivoMenuBuscador = gql`
  query {
    autores(limit: -1, sort: ["apellido"]) {
      apellido
    }
  }
`;
const { autores: datosAutores } = await obtenerDatos('archivoMenuBuscador', ArchivoMenuBuscador);

datosAutores.forEach((autor) => {
  const inicial = extraerPrimeraLetra(autor.apellido).toUpperCase();
  inicialesAutores.add(inicial);
});

autores.value = Array.from(inicialesAutores).sort();
</script>

<template>
  <div id="contenedorBuscador">
    <NuxtLink :to="'/'">
      <h2 class="logo-texto">ARCA</h2>
    </NuxtLink>

    <Buscador />

    <nav class="opcionesBuscador">
      <ul class="listaMenu">
        <li
          v-for="opcion in opciones"
          :key="opcion.slug"
          class="opcion"
          :class="paginaActual === opcion.nombre ? 'activo' : ''"
        >
          <NuxtLink class="coleccion" :to="`/archivo/${opcion.slug}`">{{ opcion.nombre }}</NuxtLink>

          <ul v-if="opcion.iniciales" class="iniciales">
            <li
              v-for="(inicial, i) in opcion.iniciales"
              :key="`inicial${i}`"
              :class="`inicial ${inicialSeleccionada === inicial ? 'activo' : ''}`"
              @click="elegirInicial(inicial)"
            >
              {{ inicial }}
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

a {
  font-family: var(--fuenteMenu);
}

#contenedorBuscador {
  background-color: var(--verdeEsmeralda);
  border-right: 0px solid var(--verdeEsmeralda);
  position: fixed;
  overflow: auto;
  width: 20vw;
  height: 100vh;
}

.logo-texto {
  font-family: var(--fuentePrincipal);
  margin: 2.5vw;
  margin-bottom: 2vw;
  margin-top: 3vw;
  color: var(--mediana);
  letter-spacing: 0.15em;
  font-size: 2em;
  overflow: hidden;
}

.opcionesBuscador {
  text-transform: uppercase;
  margin-top: 2em;
  padding: 0;
}

.listaMenu {
  margin-left: 2.5em;
  //  letter-spacing: -.01rem;
  position: relative;
}

.opcion {
  // height: 1em;
  font-size: 0.9em;
  margin-top: 0.9em;
  overflow: hidden;
  position: relative;
  padding-left: 1.4em;

  &.activo {
    .iniciales {
      height: auto;
    }
  }

  // &::before {
  //   content: '';
  //   width: 3px;
  //   height: 3px;
  //   border-radius: 50%;
  //   display: block;
  //   background-color: var(--dolor);
  //   position: absolute;
  //   left: 0.3em;
  //   top: 0.5em;
  //   z-index: 9;
  // }

  a,
  a:link {
    color: var(--mediana);

    &:hover {
      color: darken($mediana, 10%);
    }
  }
}

.iniciales {
  font-size: 1em;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  height: 0;
  transition: all 0.25s ease-out;

  .inicial {
    cursor: pointer;
    font-size: 0.8em;
    margin: 0;
    padding: 0 0.3em 0 0;

    &.activo {
      font-weight: bold;
    }
  }
}

.activo .coleccion,
.router-link-exact-active {
  font-weight: bold;
}
</style>
