<script setup>
import { convertirEscala, escalaColores } from '@enflujo/alquimia';
import { usarArchivo } from '~/cerebros/archivo';
import { gql, obtenerVariablesCSS, urlImagen } from '~/utilidades/ayudas';

const cerebroArchivo = usarArchivo();
const pending = ref(true);
let color;
let ejeX;
let colorMin;
let colorMax;

definePageMeta({ layout: 'archivo', keepalive: true });

if (!cerebroArchivo.datosCategorias) {
  await cerebroArchivo.cargarDatosCategorias();
}

onMounted(() => {
  colorMin = obtenerVariablesCSS('--amarilloArena2');
  colorMax = obtenerVariablesCSS('--rojoCerezo');

  let maximo = 0;

  cerebroArchivo.datosCategorias.forEach((categoria1) => {
    if (categoria1.obras_func.count > maximo) {
      maximo = categoria1.obras_func.count;
    }
  });

  color = escalaColores(1, maximo, colorMin, colorMax);
  ejeX = (valor) => convertirEscala(valor, 0, maximo, 0, 100);
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
  function ordenarNivel(listaCategorias, nivel) {
    ordenar(listaCategorias);

    listaCategorias.forEach((categoria) => {
      if (categoria[`categorias${nivel + 1}`]) {
        ordenarNivel(categoria[`categorias${nivel + 1}`], nivel + 1);
      }
    });
  }

  ordenarNivel(cerebroArchivo.datosCategorias, 1);
}

function ordenar(grupo) {
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

function clicSubCategorias(nivel, datosCategoria) {
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
    // Los datos existen y esta cerrado, abriro sin hacer un nuevo query.
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
  obtenerDatos(`subcategorias${nivel}${datosCategoria.id}`, Subcategoria).then((respuesta) => {
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
  <h1>Categorías</h1>
  <VistaFiltros :vistas="['abc', 'colombinas']" vistaInicial="abc" class="filtrosCategorias" />

  <Cargador v-if="pending" />

  <div v-else>
    <!-- Ver documentación del componente <TransitionGroup> en https://vuejs.org/guide/built-ins/transition-group.html -->
    <TransitionGroup name="tarjetas" tag="ul">
      <ul
        v-for="categoria1 in cerebroArchivo.datosCategorias"
        :key="`categoria1${categoria1.id}`"
        class="tarjetaCategoria"
      >
        <div v-if="categoria1.imagen" class="imagen">
          <NuxtLink :to="`/archivo/categorias1/${categoria1.slug}`">
            <img
              :src="urlImagen(categoria1.imagen.id, 'categoria')"
              :alt="categoria1.imagen.title || categoria1.nombre"
            />
          </NuxtLink>
        </div>
        <div class="informacionTarjeta">
          <h2>
            <NuxtLink :to="`/archivo/categorias1/${categoria1.slug}`">{{ categoria1.nombre }}</NuxtLink>
          </h2>
          <GraficaColombina
            :color="color(categoria1.obras_func.count)"
            :ancho="ejeX(categoria1.obras_func.count)"
            :total="categoria1.obras_func.count"
            :alto="1"
            :radio="6"
            fondoConteo="transparent"
          />

          <div v-html="categoria1.descripcion" class="descripcion"></div>

          <span
            class="mostrar"
            :class="categoria1.mostrarSubCategoria ? 'abierto' : 'cerrado'"
            @click="clicSubCategorias(1, categoria1)"
          />

          <CategoriasSubNivel
            v-if="categoria1.categorias2 && categoria1.mostrarSubCategoria"
            :datos="categoria1.categorias2"
            :nivel="2"
            :color="color"
            :ejeX="ejeX"
            :clicSubCategorias="clicSubCategorias"
          />
        </div>
      </ul>
    </TransitionGroup>
  </div>
</template>

<style lang="scss">
@use 'sass:color';

.filtrosCategorias {
  margin-bottom: 1em;
}

.tarjetaCategoria {
  transition: all 0.3s ease-in-out;
  display: flex;

  border-top: 3px solid $profundidad;
  padding: 1em 0 0.8em 0;

  .colombina {
    margin-top: -0.2em;
  }

  .imagen {
    img {
      width: 300px;
      height: 300px;
    }
  }

  .informacionTarjeta {
    padding-left: 1em;
  }

  .descripcion {
    margin-bottom: 0.5em;
  }
}

$tamañoTriangulo: 8px;

.mostrar {
  cursor: pointer;
  font-weight: bold;
  padding: 4px;
  position: relative;
  width: 1em;
  height: 1em;
  line-height: 0;
  display: inline-block;
  background-color: $profundidad;
  transition: all 0.25s ease-out;

  &.abierto {
    background-color: $dolor;
    &::after {
      content: '-';
      color: $mediana;
      font-weight: bold;
      border-width: 0;
      border-color: transparent;
      font-size: 30px;
      margin-left: -1px;
    }
  }

  &::after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 8px 4px 0 4px;
    border-color: $mediana transparent transparent transparent;
  }

  &:hover {
    background-color: lighten($profundidad, 30%);
  }

  &.sinSubNivel {
    background-color: transparent;
    border-color: transparent;
  }
}
</style>
