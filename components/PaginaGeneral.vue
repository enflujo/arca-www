<script setup>
import { gql } from '~/utilidades/ayudas';

const props = defineProps({ slug: String });
const datos = ref();

const Pagina = gql`
query {
  paginas(filter: {slug: {_eq: "${props.slug}"}}) {
    titulo
    descripcion
    contenido
    banner {
      id
      title
    }
  }
}
`;

const { paginas } = await obtenerDatos(`pagina${props.slug}`, Pagina);

if (paginas.length) {
  datos.value = paginas[0];
} else {
  throw createError({ statusCode: 404, statusMessage: 'Arca en problemas', fatal: true });
}
</script>

<template>
  <h1>{{ datos.titulo }}</h1>
  <div class="contenidoPagina" v-html="datos.contenido"></div>
</template>
