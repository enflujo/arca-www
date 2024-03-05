<script setup lang="ts">
import type { Imagen, Pagina } from '~/tipos';
import { gql } from '~/utilidades/ayudas';

interface Props {
  slug: string;
}

interface DatosPagina {
  titulo: string;
  descripcion: string;
  contenido: string;
  banner: Imagen;
}

interface Esquema {
  paginas: DatosPagina[];
}

const props = defineProps<Props>();
const datos: Ref<DatosPagina | null> = ref(null);

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

const { paginas } = await obtenerDatos<Esquema>(`pagina${props.slug}`, Pagina);

if (paginas.length) {
  datos.value = paginas[0];
} else {
  throw createError({ statusCode: 404, message: 'Arca en problemas', fatal: true });
}
</script>

<template>
  <h1 v-if="datos">{{ datos.titulo }}</h1>
  <div v-if="datos" class="contenidoPagina" v-html="datos.contenido"></div>
</template>
