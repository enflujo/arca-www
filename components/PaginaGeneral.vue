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
const ruta = useRoute();

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
  const datosPagina = paginas[0];
  datos.value = datosPagina;

  useHead(
    elementosCabeza(
      {
        titulo: datosPagina.titulo,
        descripcion: datosPagina.descripcion,
        banner: datosPagina.banner,
      },
      ruta.path
    )
  );
} else {
  throw createError({ statusCode: 404, message: 'Arca en problemas', fatal: true });
}
</script>

<template>
  <h1 v-if="datos">{{ datos.titulo }}</h1>
  <div v-if="datos" class="contenidoPagina" v-html="datos.contenido"></div>
</template>
