<script setup lang="ts">
import { convertirEscala, escalaColores } from '@enflujo/alquimia';
import type { Categoria } from '~/tipos';
import { usarArchivo } from '~/cerebros/archivo';
import { gql, obtenerVariablesCSS, peticion } from '~/utilidades/ayudas';

const cerebroArchivo = usarArchivo();
const pending: Ref<boolean> = ref(true);
const pagina: Ref<Esquema | null | undefined> = ref(null);
const ruta = useRoute();

// Usar refs reactivos para las funciones de escala
const color = ref<(valor: number) => string>(() => '#000000');
const ejeX = ref<(valor: number) => number>(() => 0);

interface Esquema {
  titulo: string;
  slug: string;
  contenido: string;
  descripcion: string;
  banner: { id: number; title: string };
}

const GeneralCategorias = gql`
  query {
    paginas_archivo(filter: { coleccion: { _eq: "categorias1" } }, limit: 1) {
      titulo
      slug
      contenido
      descripcion
      banner {
        id
        title
      }
    }
  }
`;

const { paginas_archivo } = await obtenerDatos<{ paginas_archivo: Esquema[] }>('generalCategorias', GeneralCategorias);

pagina.value = paginas_archivo[0];

definePageMeta({ layout: 'archivo', keepalive: true });

if (!paginas_archivo || paginas_archivo.length === 0 || !pagina.value) {
  throw createError({ statusCode: 404, message: 'No existen datos para esta página' });
}

// Pedir datos básicos de esto y ponerlos en los metadatos
useHead(
  elementosCabeza(
    {
      titulo: pagina.value.titulo,
      descripcion: pagina.value.descripcion || pagina.value.contenido.replace(/(<([^>]+)>)/gi, ''),
      banner: pagina.value.banner,
    },
    ruta.path
  )
);

if (!cerebroArchivo.datosCategorias) {
  await cerebroArchivo.cargarDatosCategorias();
}

// Largo de la línea junto al conteo de obras, proporcional al tema con más obras (se calcula también en el servidor).
const maximoObras = computed(() =>
  Math.max(1, ...(cerebroArchivo.datosCategorias ?? []).map((categoria) => categoria.obras_func.count))
);

function anchoConteo(cantidad: number) {
  return Math.max(4, (cantidad / maximoObras.value) * 100);
}

// Botones «A – Z» / «Por cantidad». El orden queda en la URL (?vista=colombinas) para poder compartirlo.
const enrutador = useRouter();

function cambiarOrden(vista: 'abc' | 'colombinas') {
  cerebroArchivo.vistaActual = vista;
  enrutador.replace({ query: { ...ruta.query, vista: vista === 'abc' ? undefined : vista } });
}

onMounted(() => {
  cerebroArchivo.vistaActual = ruta.query.vista === 'colombinas' ? 'colombinas' : 'abc';

  const colorMin = obtenerVariablesCSS('--amarilloArena2');
  const colorMax = obtenerVariablesCSS('--rojoCerezo');

  let maximo = 0;

  if (cerebroArchivo.datosCategorias) {
    cerebroArchivo.datosCategorias.forEach((categoria1) => {
      if (categoria1.obras_func.count > maximo) {
        maximo = categoria1.obras_func.count;
      }
    });
  }

  color.value = escalaColores(1, maximo, colorMin, colorMax);
  ejeX.value = (valor: number) => convertirEscala(valor, 0, maximo, 0, 100);
  pending.value = false;
});

watch(
  () => cerebroArchivo.vistaActual,
  () => {
    if (cerebroArchivo.datosCategorias) {
      ordenarTodos();
    }
  }
);

function ordenarTodos() {
  if (!cerebroArchivo.datosCategorias) return;

  function ordenarNivel(listaCategorias: Categoria[], nivel: number) {
    ordenar(listaCategorias);

    listaCategorias.forEach((categoria) => {
      if (categoria[`categorias${nivel + 1}`]) {
        ordenarNivel(categoria[`categorias${nivel + 1}`], nivel + 1);
      }
    });
  }

  ordenarNivel(cerebroArchivo.datosCategorias, 1);
}

function ordenar(grupo: Categoria[]) {
  const { vistaActual } = cerebroArchivo;

  if (vistaActual === 'abc') {
    grupo.sort((a, b) => {
      if (a.slug < b.slug) return -1;
      if (a.slug > b.slug) return 1;
      return 0;
    });
  } else if (vistaActual === 'colombinas') {
    grupo.sort((a, b) => {
      if (a.obras_func.count > b.obras_func.count) return -1;
      if (a.obras_func.count < b.obras_func.count) return 1;
      return 0;
    });
  }
}

async function clicSubCategorias(nivel: number, datosCategoria: Categoria) {
  const nivel1 = `categorias${nivel}`;
  const nivel2 = `categorias${nivel + 1}`;
  const nivel3 = nivel + 2 <= 6 ? `categorias${nivel + 2}` : null;

  /**
   * Revisar si los datos ya existen antes de hacer el query
   */
  if (datosCategoria.mostrarSubCategoria) {
    // Los datos ya existen y esta abierto, quiere decir que el usuario quiere cerrar el submenú.
    datosCategoria.mostrarSubCategoria = false;
    return;
  } else if (!datosCategoria.mostrarSubCategoria && datosCategoria[nivel2]) {
    // Los datos existen y esta cerrado, abrirlo sin hacer un nuevo query.
    datosCategoria.mostrarSubCategoria = true;
    return;
  }

  /**
   * No hay datos aún así que podemos hacer el query y procesar el resultado.
   */
  const Subcategoria = gql`
    query {
      ${nivel1}_by_id(id: ${datosCategoria.id}) {
        ${nivel2}(sort: ["nombre"], limit: -1) {
          id
          slug
          nombre
          descripcion
          obras_func {
            count
          }
          ${nivel3 ? `${nivel3}_func {count}` : ''}
        }
      }
    }
  `;

  // No usamos async/await ya que en vue3 con <script setup> solo podemos crear 1 función async.
  peticion(Subcategoria).then((respuesta) => {
    const datosSubCategoria = respuesta[`${nivel1}_by_id`][nivel2];

    if (cerebroArchivo.vistaActual !== 'abc') {
      ordenar(datosSubCategoria);
    }
    datosCategoria[nivel2] = datosSubCategoria;
    datosCategoria.mostrarSubCategoria = true;
  });
}
</script>

<template>
  <div class="encabezadoTemas">
    <div class="encabezadoPagina">
      <p class="ceja">Colección de ARCA</p>
      <h1 class="tituloPagina">{{ pagina?.titulo }}</h1>
    </div>
    <div class="ordenar" role="group" aria-label="Ordenar temas">
      <span class="etiquetaOrdenar">Ordenar los temas</span>
      <button
        type="button"
        class="botonOrden"
        :class="{ activo: cerebroArchivo.vistaActual !== 'colombinas' }"
        :aria-pressed="cerebroArchivo.vistaActual !== 'colombinas'"
        @click="cambiarOrden('abc')"
      >
        A – Z
      </button>
      <button
        type="button"
        class="botonOrden"
        :class="{ activo: cerebroArchivo.vistaActual === 'colombinas' }"
        :aria-pressed="cerebroArchivo.vistaActual === 'colombinas'"
        @click="cambiarOrden('colombinas')"
      >
        Por cantidad
      </button>
    </div>
  </div>

  <!-- Ver documentación del componente <TransitionGroup> en https://vuejs.org/guide/built-ins/transition-group.html -->
  <TransitionGroup name="tarjetas" tag="div" class="listaTemas">
    <article
      v-for="categoria1 in cerebroArchivo.datosCategorias"
      :key="`categoria1${categoria1.id}`"
      class="panelClaro tarjetaTema"
    >
      <NuxtLink v-if="categoria1.imagen" :to="`/categorias1/${categoria1.slug}`" class="imagenTema" tabindex="-1">
        <ImagenArca
          :datos="{ ...categoria1.imagen, ancho: categoria1.imagen.width, alto: categoria1.imagen.height }"
          :titulo="categoria1.nombre"
          llave="categoria"
          rutaIcono="/arca-icono.svg"
        />
      </NuxtLink>

      <div class="infoTema">
        <h2 class="nombreTema">
          <NuxtLink :to="`/categorias1/${categoria1.slug}`">{{ categoria1.nombre }}</NuxtLink>
        </h2>

        <div class="conteoTema">
          <span class="lineaConteo" aria-hidden="true">
            <span class="relleno" :style="{ width: `${anchoConteo(categoria1.obras_func.count)}%` }"></span>
          </span>
          <span class="puntoConteo" aria-hidden="true"></span>
          <span class="numeroConteo">{{ categoria1.obras_func.count }}</span>
          <span class="textoConteo">obras</span>
        </div>

        <div v-html="categoria1.descripcion" class="descripcion"></div>

        <button
          type="button"
          class="desplegar"
          :class="{ abierto: categoria1.mostrarSubCategoria }"
          :aria-expanded="!!categoria1.mostrarSubCategoria"
          @click="clicSubCategorias(1, categoria1)"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          {{ categoria1.mostrarSubCategoria ? 'Ocultar categorías' : 'Desplegar categorías' }}
        </button>

        <CategoriasSubNivel
          v-if="categoria1.categorias2 && categoria1.mostrarSubCategoria"
          :datos="categoria1.categorias2"
          :nivel="2"
          :color="color"
          :ejeX="ejeX"
          :clicSubCategorias="clicSubCategorias"
        />
      </div>
    </article>
  </TransitionGroup>
</template>

<style lang="scss">
// Clasificación por temas · diseño «Colección · Clasificación por temas-html»
.encabezadoTemas {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 32px;
  margin-bottom: 32px;

  .encabezadoPagina {
    margin-bottom: 0 !important;
  }
}

// Selector de orden destacado (control segmentado), como en los demás índices de la Colección.
.ordenar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  padding: 4px 4px 4px 14px;
  border-radius: 999px;
  background-color: var(--tintaPanel);
  border: 1px solid #5a4a3e;

  .etiquetaOrdenar {
    font-size: 13px;
    font-weight: 600;
    color: var(--sobreOscuro);
  }
}

.botonOrden {
  height: 34px;
  padding: 0 16px;
  border-radius: 999px;
  border: 0;
  background: transparent;
  color: var(--sobreOscuroSuave);
  font-family: var(--fuenteSans);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: var(--oro);
  }

  &.activo {
    background-color: var(--oro);
    color: var(--tinta);
    font-weight: 700;
  }
}

.listaTemas {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tarjetaTema {
  transition: all 0.3s ease-in-out;
  padding: clamp(14px, 1.6vw, 20px);
  display: flex;
  flex-direction: column;
  gap: 16px 26px;
}

.imagenTema {
  flex-shrink: 0;
  display: block;

  img {
    width: 100% !important;
    aspect-ratio: 1;
    height: auto;
    object-fit: cover;
    border-radius: 12px;
    display: block;
    background-color: var(--arena);
  }
}

.infoTema {
  flex-grow: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.nombreTema {
  margin: 0;
  font-family: var(--fuenteSerif);
  font-weight: 400;
  font-size: clamp(21px, 1.9vw, 27px);
  line-height: 1.05;

  a:link,
  a:visited {
    color: var(--tinta);
  }

  a:hover {
    color: var(--ocre);
  }
}

.conteoTema {
  display: flex;
  align-items: center;
  gap: 12px;

  .lineaConteo {
    position: relative;
    height: 1px;
    width: 180px;
    flex-shrink: 1;
    background-color: #e0d3b8;
  }

  // La parte llena de la línea es proporcional al número de obras del tema.
  .relleno {
    position: absolute;
    left: 0;
    top: -1px;
    height: 3px;
    border-radius: 2px;
    background-color: #d6c3a0;
  }

  .puntoConteo {
    width: 7px;
    height: 7px;
    flex-shrink: 0;
    border-radius: 999px;
    background-color: var(--ocre);
  }

  .numeroConteo {
    font-size: 14px;
    font-weight: 700;
    color: var(--ocre);
  }

  .textoConteo {
    font-size: 14px;
    color: #64492b;
  }
}

.tarjetaTema .descripcion,
.tarjetaTema .descripcion p {
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: var(--textoCuerpo);
}

.desplegar {
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  padding: 0 16px 0 12px;
  border: 1px solid #d6c3a0;
  border-radius: 999px;
  background: transparent;
  color: var(--tinta);
  font-family: var(--fuenteSans);
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    border-color: var(--ocre);
  }

  svg {
    width: 13px;
    height: 14px;
    fill: none;
    stroke: var(--ocre);
    stroke-width: 2.4;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform 0.2s ease;
  }

  &.abierto svg {
    transform: rotate(180deg);
  }
}

// Subcategorías (components/Categorias/SubNivel.vue)
.tarjetaTema {
  .categoriaSubNivel {
    margin-top: 4px;
    padding-left: 4px;
    border-left: 1px solid #e0d3b8;

    .categoriaSubNivel {
      margin-left: 14px;
    }
  }

  .subCategoria {
    padding: 4px 0 4px 10px;
    align-items: center;
  }

  .subCategoriaTitulo {
    font-size: 15px !important;

    &:link,
    &:visited {
      color: var(--tinta);
    }

    &:hover {
      color: var(--ocre);
    }
  }
}

.mostrar {
  cursor: pointer;
  position: relative;
  width: 18px;
  height: 18px;
  margin-right: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 999px;
  border: 1px solid #d6c3a0;
  transition: all 0.2s ease-out;

  &::after {
    content: '';
    display: block;
    border-style: solid;
    border-width: 5px 4px 0 4px;
    border-color: var(--ocre) transparent transparent transparent;
    transition: transform 0.2s ease;
  }

  &.abierto::after {
    transform: rotate(180deg);
  }

  &:hover {
    border-color: var(--ocre);
  }

  &.sinSubNivel {
    border-color: transparent;
    cursor: default;

    &::after {
      display: none;
    }
  }
}

@media (min-width: $minTablet) {
  .tarjetaTema {
    flex-direction: row;
    align-items: stretch;
  }

  .imagenTema {
    width: clamp(140px, 13vw, 180px);
  }

  .infoTema {
    padding: 6px 8px 6px 0;
  }
}
</style>
