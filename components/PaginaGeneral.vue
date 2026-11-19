<script setup lang="ts">
import type { Imagen } from '~/tipos';
import { gql } from '~/utilidades/ayudas';
import { imagenesCMS, type ImagenPagina } from '~/utilidades/contenidoCMS';
import { seccionDeRuta, NOMBRE_SECCION } from '~/utilidades/menu';
import { urlImagenPublica } from '~/utilidades/seo';

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
const ruta = useRoute();

// Páginas con diseño propio en el rediseño 2026. Las demás usan la plantilla general.
const PLANTILLAS: Record<string, { descripcion: string; altImagen?: string }> = {
  'sobre-arca': {
    descripcion:
      'ARCA es una base de datos relacional e interactiva de pintura colonial americana: colecciones, metadatos y lecturas personales de temas.',
    altImagen: 'Retrato colonial de un hombre sentado ante una mesa con libros y papeles',
  },
  'arca-version-2016-2022': {
    descripcion:
      'El primer portal de ARCA (2016–2022): un archivo virtual de la producción pictórica colonial americana, dispersa en miles de colecciones.',
    altImagen: 'Captura del primer portal de ARCA, con el menú de archivos y herramientas sobre una pintura de paisaje',
  },
  'productos-relacionados': {
    descripcion:
      'Publicaciones y desarrollos que salen de la base de datos de ARCA, como el e-book Los ingenios del pincel.',
    altImagen: 'Portada del e-book: un taller de pintura colonial con cuadros colgados y pintores trabajando',
  },
  'bibliografia-y-referencias': {
    descripcion:
      'Condiciones de uso de las imágenes de ARCA y bibliografía general de las fuentes de la colección de pintura colonial americana.',
  },
  'open-source': {
    descripcion: 'Todo el desarrollo de ARCA es abierto: API, sitio, procesamiento de datos y analítica en GitHub.',
    altImagen: 'Detalle de una pintura colonial: un grupo de figuras que miran y gesticulan',
  },
};

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
const datos = paginas?.[0];

if (!datos) {
  throw createError({ statusCode: 404, message: 'Página no encontrada', fatal: true });
}

const plantilla = PLANTILLAS[props.slug];
const seccion = NOMBRE_SECCION[seccionDeRuta(ruta.path)];

// Imagen del CMS. Si su texto alternativo trae el número de obra, se buscan título y autor para el crédito.
const imagenCMS = imagenesCMS(datos.contenido)[0];
let imagen: ImagenPagina | undefined;

if (imagenCMS) {
  imagen = {
    src: urlImagenPublica(imagenCMS.id, plantilla?.altImagen || datos.titulo),
    alt: plantilla?.altImagen || imagenCMS.alt,
  };

  if (imagenCMS.registro) {
    const { obras } = await obtenerDatos<{
      obras: { registro: number; titulo: string; autores: { autores_id: { nombre?: string; apellido?: string } }[] }[];
    }>(
      `obraImagen${imagenCMS.registro}`,
      gql`query { obras(filter: { registro: { _eq: ${imagenCMS.registro} } }, limit: 1) { registro titulo autores { autores_id { nombre apellido } } } }`
    );
    const obra = obras?.[0];
    if (obra) {
      imagen.obra = {
        registro: obra.registro,
        titulo: obra.titulo,
        autor: obra.autores
          .map((a) => [a.autores_id.nombre, a.autores_id.apellido].filter(Boolean).join(' '))
          .join(', '),
      };
      imagen.alt = `${imagen.alt}. ${obra.titulo}${imagen.obra.autor ? `, ${imagen.obra.autor}` : ''}`;
    }
  }
}

useHead(
  elementosCabeza(
    {
      titulo: datos.titulo,
      descripcion: datos.descripcion || plantilla?.descripcion,
      banner: datos.banner,
    },
    ruta.path
  )
);
</script>

<template>
  <PaginasSobreArca v-if="slug === 'sobre-arca'" :seccion="seccion" :imagen="imagen" />
  <PaginasArca2016 v-else-if="slug === 'arca-version-2016-2022'" :seccion="seccion" :imagen="imagen" />
  <PaginasProductos v-else-if="slug === 'productos-relacionados'" :seccion="seccion" :imagen="imagen" />
  <PaginasBibliografia
    v-else-if="slug === 'bibliografia-y-referencias'"
    :seccion="seccion"
    :contenido="datos.contenido"
  />
  <PaginasOpenSource v-else-if="slug === 'open-source'" :seccion="seccion" :imagen="imagen" />

  <!-- Plantilla general para páginas sin diseño propio -->
  <template v-else>
    <h1>{{ datos.titulo }}</h1>
    <div class="contenidoPagina" v-html="datos.contenido"></div>
  </template>
</template>
