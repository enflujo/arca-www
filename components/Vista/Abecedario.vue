<script setup>
import { eliminarTildes } from '~~/utilidades/ayudas';

const abc = ref([]);

const props = defineProps({
  coleccion: String,
  datos: Array,
});

onMounted(() => {
  if (props.coleccion === 'autores') {
    procesarDatos('apellido');
  } else {
    procesarDatos('slug');
  }
});

function procesarDatos(llave) {
  const respuesta = [];

  props.datos.forEach((instancia) => {
    const primeraLetra = eliminarTildes(instancia[llave].charAt(0)).toLowerCase();
    let elementosLetra = respuesta.find((obj) => obj.letra === primeraLetra);

    if (!elementosLetra) {
      elementosLetra = { letra: primeraLetra, elementos: [] };
      respuesta.push(elementosLetra);
    }

    let texto = '';
    let url = '';

    if (llave === 'apellido') {
      url = instancia.url;
      texto = `${instancia.nombreCompleto} (${instancia.obras_func.count})`;
    } else {
      url = `/archivo/${props.coleccion}/${instancia.slug}`;
      texto = `${instancia.nombre} (${instancia.obras_func.count})`;
    }

    elementosLetra.elementos.push({ url, texto });
  });

  respuesta.sort((a, b) => {
    if (a.letra < b.letra) return -1;
    if (a.letra > b.letra) return 1;
    return 0;
  });

  abc.value = respuesta;
}
</script>

<template>
  <section v-for="seccion in abc" :key="`seccion${seccion.letra}`">
    <h2 class="tituloLetra">{{ seccion.letra }}</h2>
    <ul class="elementos">
      <li v-for="(elemento, i) in seccion.elementos" :key="`elemento${i}`" class="elemento">
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
