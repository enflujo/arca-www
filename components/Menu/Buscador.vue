<script setup>
const ruta = useRoute();

const opciones = [
  { nombre: 'Autores', slug: 'autores' },
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

const esRutaActual = (slug) => {
  const partes = ruta.path.split('/');

  if (partes[2].includes('categorias')) {
    return slug === 'categorias';
  } else if (partes[2] === 'paises') {
    return slug === 'ubicaciones';
  }
  return partes.includes(slug);
};
</script>

<template>
  <aside id="contenedorBuscador">
    <h2 class="nombreProyecto"><NuxtLink :to="'/'">ARCA</NuxtLink></h2>

    <nav id="opciones">
      <ul class="listaMenu">
        <li
          v-for="opcion in opciones"
          :key="opcion.slug"
          class="opcion"
          :class="esRutaActual(opcion.slug) ? 'activo' : ''"
        >
          <NuxtLink class="coleccion" :to="`/archivo/${opcion.slug}`">{{ opcion.nombre }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style lang="scss" scoped>
@use 'sass:color';

#contenedorBuscador {
  background-color: var(--verdeEsmeralda);
  border-right: 0px solid var(--verdeEsmeralda);
  position: fixed;
  overflow: auto;
  width: 20vw;
  height: 100vh;
}

.nombreProyecto {
  padding: 1.3em 0 1em 0;

  a {
    font-family: var(--fuentePrincipal);
    font-weight: bold;
    margin-left: 1.3em;
    color: var(--mediana);
    letter-spacing: 0.15em;
    font-size: 1.35em;
    overflow: hidden;
  }
}

#opciones {
  text-transform: uppercase;
  margin: 0 0 3em 2.5em;
  padding: 0;
  position: relative;

  li {
    padding: 0;
  }
}

.opcion {
  font-size: 0.9em;
  margin-top: 0.9em;
  overflow: hidden;
  position: relative;
  padding-left: 1.4em;

  &.activo {
    .iniciales {
      height: auto;
    }

    a {
      color: darken($mediana, 20%);
    }
  }

  a,
  a:link {
    color: var(--mediana);
    font-family: var(--fuenteMenu);
    font-weight: bold;

    &:hover {
      color: darken($mediana, 10%);
    }
  }
}
</style>
