<script setup>
import { eliminarTildes } from '~~/utilidades/ayudas';

const abc = reactive({});

const props = defineProps({
  coleccion: String,
  datos: Array,
});

onMounted(() => {
  if (props.coleccion === 'autores') {
    procesarAutores();
  } else {
    procesar();
  }
});

function procesarAutores() {
  props.datos.forEach((autor) => {
    const primeraLetraApellido = eliminarTildes(autor.apellido[0]).toLowerCase();
    if (!abc[primeraLetraApellido]) {
      abc[primeraLetraApellido] = [];
    }

    abc[primeraLetraApellido].push({
      url: `/archivo/${props.coleccion}/${autor.id}`,
      texto: `${autor.apellido}, ${autor.nombre} (${autor.obras_func.count})`,
    });
  });
}

function procesar() {
  props.datos.forEach((elemento) => {
    const primeraLetra = eliminarTildes(elemento.slug[0]);
    if (!abc[primeraLetra]) {
      abc[primeraLetra] = [];
    }

    abc[primeraLetra].push({
      url: `/archivo/${props.coleccion}/${elemento.slug}`,
      texto: `${elemento.nombre} (${elemento.obras_func.count})`,
    });
  });
}
</script>

<template>
  <section v-for="(seccion, letra) in abc" :key="`seccion${letra}`">
    <h2 class="tituloLetra">{{ letra }}</h2>
    <ul class="elementos">
      <li v-for="(elemento, i) in seccion" :key="`elemento${i}`" class="elemento">
        <NuxtLink :to="elemento.url">{{ elemento.texto }}</NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.tituloLetra {
  text-transform: uppercase;
}

.elementos {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 0 1.5em 0;
}

.elemento {
  padding: 0.3em 1.3em 0.3em 0;
}
</style>
