<script setup lang="ts">
import { eliminarTildes } from '~/utilidades/ayudas';

const props = defineProps({
  coleccion: String,
  datos: Array,
});
const abc = ref([]);

watch(() => props.datos, procesarDatos);
onMounted(procesarDatos);

function procesarDatos() {
  let llave = 'slug';

  if (props.coleccion === 'autores') {
    llave = 'apellido';
  } else if (props.coleccion === 'ciudades' || props.coleccion === 'ubicaciones') {
    llave = 'nombre';
  }

  const respuesta = [];

  props.datos.forEach((instancia) => {
    const primeraLetra = eliminarTildes(instancia[llave].charAt(0)).toLowerCase();
    let elementosLetra = respuesta.find((obj) => obj.letra === primeraLetra);

    if (!elementosLetra) {
      elementosLetra = { letra: primeraLetra, elementos: [] };
      respuesta.push(elementosLetra);
    }

    elementosLetra.elementos.push({ url: instancia.url, texto: instancia.texto });
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
  <section v-for="seccion in abc" :key="`seccion${seccion.letra}`" class="grupoLetras">
    <h2 class="tituloLetra">{{ seccion.letra }}</h2>
    <ul class="elementos">
      <li v-for="(elemento, i) in seccion.elementos" :key="`elemento${i}`" class="elemento">
        <NuxtLink :to="elemento.url">{{ elemento.texto }}</NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.grupoLetras {
  border-top: 3px solid $rojoCerezo;
}
.tituloLetra {
  text-transform: uppercase;
  border-top: none;
  display: inline-block;
  padding: 0.3em;
  margin-right: 0.5em;
}

.elementos {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 0 1.5em 0;
}

.elemento {
  border: 1px solid $profundidad;
  margin: 0.2em;
  background-color: transparent;
  transition: all 0.2s ease-in;

  a {
    padding: 0.4em;
    display: block;
  }

  &:hover {
    background-color: $rojoCerezo;
    a,
    a:link {
      color: $claridad;
    }
  }
}
</style>
