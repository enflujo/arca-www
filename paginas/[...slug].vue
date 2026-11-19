<script setup lang="ts">
import type { PaginaArchivo } from '~/tipos';
import { usarGeneral } from '~/cerebros/general';
import { gql, procesarTextoHTML } from '~/utilidades/ayudas';
import { seccionDeRuta } from '~/utilidades/menu';

interface EsquemaPaginaArchivo {
  paginas_archivo: PaginaArchivo[];
}

// Desactivar el layout automático de Nuxt para usar NuxtLayout manualmente
definePageMeta({
  layout: false,
});

const cerebroGeneral = usarGeneral();
const ruta = useRoute();

// Asegurarse de que los datos generales estén cargados
if (!cerebroGeneral.datosCargados) {
  await useAsyncData('cargarGeneral', async () => {
    await cerebroGeneral.cargarGeneral();
    return true;
  });
}

// Normaliza el catch-all: puede ser string o string[]
const slugParam = computed<string[]>(() => {
  const p = ruta.params.slug;
  if (Array.isArray(p)) return p;
  if (typeof p === 'string' && p.length) return [p];
  return [];
});

const indice = computed(() => slugParam.value[0] ?? '');
const slug = computed(() => slugParam.value[1] ?? '');

const tipoPagina = ref<'general' | 'archivoIndice' | 'archivoSingular' | ''>('');
const datos = ref<PaginaArchivo | undefined>(undefined);
const enTablaRelacional = ref(false);
const nombreCampo = ref<string | undefined>(undefined);

const esPaginaGeneral = cerebroGeneral.paginas.find((p) => p.slug === indice.value);
const esPaginaArchivo = cerebroGeneral.paginasArchivo.find((p) => p.slug === indice.value);

// Cargar datos síncronamente antes del render
if (indice.value) {
  // 1) Página general
  if (esPaginaGeneral) {
    tipoPagina.value = 'general';
  }
  // 2) Página de archivo
  else if (esPaginaArchivo) {
    // 2a) Índice de archivo
    if (!slug.value) {
      tipoPagina.value = 'archivoIndice';

      const IndiceQuery = gql`
        query {
          paginas_archivo(filter: { slug: { _eq: "${indice.value}" } }) {
            descripcion
            contenido
            coleccion
            banner {
              id
              title
            }
          }
        }
      `;

      const { paginas_archivo } = await obtenerDatos<EsquemaPaginaArchivo>(`indice${indice.value}`, IndiceQuery);

      const fila = paginas_archivo?.[0];
      if (fila) {
        datos.value = { ...esPaginaArchivo, ...fila };

        const { descripcion, banner, contenido } = fila;
        useHead(
          elementosCabeza(
            {
              titulo: esPaginaArchivo.titulo,
              descripcion: descripcion || procesarTextoHTML(contenido),
              banner,
            },
            ruta.path
          )
        );
      }
    }
    // 2b) Archivo singular
    else {
      tipoPagina.value = 'archivoSingular';

      const IndiceGaleriaQuery = gql`
        query {
          paginas_archivo(filter: { slug: { _eq: "${indice.value}" } }) {
            descripcion
            coleccion
            titulo_singular
            banner {
              id
              title
            }
          }
        }
      `;

      const respuesta = await obtenerDatos<EsquemaPaginaArchivo>(
        `galeria${indice.value}${slug.value}`,
        IndiceGaleriaQuery
      );

      const fila = respuesta?.paginas_archivo?.[0];
      if (fila) {
        const relacion = cerebroGeneral.relaciones.find((r) => {
          if (r.campo === 'ciudad_origen') return false;
          return r.coleccionRelacionada === fila.coleccion;
        });

        if (relacion) {
          nombreCampo.value = relacion.campo;
        } else {
          enTablaRelacional.value = true;
        }
        datos.value = { ...esPaginaArchivo, ...fila };
      }
    }
  }
}

// Layout calculado dinámicamente
const layoutActual = computed(() => {
  // Las páginas de Recursos y Sobre ARCA usan el layout con menú lateral de su sección (rediseño 2026).
  const seccion = seccionDeRuta(`/${indice.value}`);
  if (esPaginaGeneral && (seccion === 'recursos' || seccion === 'sobre')) return 'archivo';
  // Otras páginas generales usan layout paginas (sin sidebar)
  if (esPaginaGeneral) return 'paginas';
  // Archivos usan layout archivo
  if (esPaginaArchivo) return 'archivo';
  // Por defecto usa layout default
  return 'default';
});
</script>

<template>
  <NuxtLayout :name="layoutActual">
    <PaginaGeneral v-if="tipoPagina === 'general'" :slug="indice" />

    <!-- Índices de la Colección (autores, técnicas, países…): misma apariencia que «Clasificación por temas». -->
    <div v-else-if="datos && tipoPagina === 'archivoIndice'" class="indiceColeccion">
      <div class="encabezadoPagina">
        <p class="ceja">Colección de ARCA</p>
        <h1 class="tituloPagina">{{ datos.titulo }}</h1>
      </div>
      <div v-if="datos.contenido" class="panelClaro panelDescripcion" v-html="datos.contenido"></div>
      <div class="panelClaro panelIndice">
        <Vista :coleccion="datos.coleccion" :slug="datos.slug" />
      </div>
    </div>

    <Galeria
      v-else-if="datos && tipoPagina === 'archivoSingular'"
      :coleccion="datos.coleccion"
      :nombreCampo="nombreCampo"
      :singular="datos.titulo_singular"
      :enTablaRelacional="enTablaRelacional"
      :slug="slug"
    />
  </NuxtLayout>
</template>

<style lang="scss">
.indiceColeccion {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .encabezadoPagina {
    margin-bottom: 12px !important;
  }

  .panelDescripcion {
    padding: clamp(20px, 2.6vw, 28px) clamp(20px, 3vw, 32px);

    p {
      margin: 0 0 0.8em;
      font-size: 17px;
      line-height: 1.65;
      color: var(--textoCuerpo);

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .panelIndice {
    padding: clamp(18px, 2.6vw, 28px) clamp(16px, 3vw, 32px);
    min-height: 200px;
  }
}

.contenidoPagina {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 1em 0;
  }
}
</style>
