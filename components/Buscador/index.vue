<script setup lang="ts">
import { InstantMeiliSearchInstance, instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { apiBase, urlBuscador } from '~~/config/general';
import { usarGeneral } from '~~/cerebros/general';
import { urlImagen } from '~~/utilidades/ayudas';

const cerebroGeneral = usarGeneral();
const resultados: Ref<HTMLDivElement | null> = ref(null);
let clienteBuscador: InstantMeiliSearchInstance;
const confirguracionBuscador = {
  // placeholderSearch: false,
  primaryKey: 'registro',
};

if (!cerebroGeneral.llaveBuscador) {
  const llave = await fetch(`${apiBase}/arca-datos/llave-buscador`).then((res) => res.text());

  if (llave) {
    cerebroGeneral.llaveBuscador = llave;
    clienteBuscador = instantMeiliSearch(urlBuscador, cerebroGeneral.llaveBuscador, confirguracionBuscador);
  }
} else {
  clienteBuscador = instantMeiliSearch(urlBuscador, cerebroGeneral.llaveBuscador, confirguracionBuscador);
}

const campos = [
  ['registro', 'Registro'],
  ['titulo', 'Título'],
  ['autores', 'Autores'],
  ['sintesis', 'Síntesis'],
  ['fuente', 'Fuente'],
  ['categorias', 'Categorías'],
  ['donante', 'Donante'],
  ['ciudad_origen', 'Ciudad de Origen'],
  ['ubicacion', 'Ubicación'],
  ['ciudad', 'Ciudad'],
  ['pais', 'País'],
  ['relato_visual', 'Relato Visual'],
  ['tipo_gestual', 'Tipo Gestual'],
  ['complejo_gestual', 'Complejo Gestual'],
  ['fisiognomica', 'Fisiognómica'],
  ['fisiognomica_imagen', 'Fisiognómica Imagen'],
  ['rostro', 'Rostro'],
  ['escenarios', 'Escenarios'],
  ['objetos', 'Objetos'],
  ['tecnicas', 'Técnicas'],
  ['gestos', 'Gestos'],
  ['personajes', 'Personajes'],
  ['simbolos', 'Simbolos'],
  ['descriptores', 'Descriptores'],
  ['caracteristicas', 'Características Particulares'],
];

function cerrar(evento: MouseEvent) {
  if (!evento.target) return;

  if (evento.target.id === 'buscador' || evento.target.id === 'botonCerrar') {
    cerebroGeneral.buscadorVisible = false;
  }
}

function salir() {
  cerebroGeneral.buscadorVisible = false;
}

function cambioDePagina() {
  if (resultados.value && resultados.value.$el) {
    resultados.value.$el.scrollTop = 0;
  }
}

function entradaBuscador(evento: InputEvent) {
  if (typeof evento === 'string') {
    cerebroGeneral.busquedaActual = evento;
  }
}
</script>

<template>
  <div id="botonCerrar" @click="cerrar">x</div>
  <ClientOnly>
    <ais-instant-search id="buscador" :search-client="clienteBuscador" index-name="obras" @click="cerrar">
      <ais-configure :attributesToSnippet="['sintesis:20']" :snippetEllipsisText="'...'" :hits-per-page.camel="11" />

      <ais-search-box
        placeholder="Buscar..."
        reset-title="Borrar"
        :value="cerebroGeneral.busquedaActual"
        @input="entradaBuscador"
        :autofocus="true"
        :class-names="{
          'ais-SearchBox': 'buscadorContenedor',
          'ais-SearchBox-form': 'buscadorFormulario',
          'ais-SearchBox-input': 'buscadorElemento',
          'ais-SearchBox-submit': 'buscadorEnviar',
          'ais-SearchBox-submitIcon': 'buscadorIcono',
          'ais-SearchBox-reset': 'buscadorBorrar',
          'ais-SearchBox-resetIcon': 'buscadorIconoBorrar',
          'ais-SearchBox-loadingIndicator': 'buscadorCargando',
          'ais-SearchBox-loadingIcon': 'buscadorCargandoIcono',
        }"
      />

      <ais-pagination
        @page-change="cambioDePagina"
        :class-names="{
          'ais-Pagination': 'contenedorPaginas',
          'ais-Pagination-list': 'listaPaginas',
          'ais-Pagination-item': 'pagina',
          'ais-Pagination-item--selected': 'paginaActual',
          'ais-Pagination-item--disabled': 'paginaDesabilitada',
        }"
      />

      <ais-hits
        id="resultados"
        ref="resultados"
        :class-names="{
          'ais-Hits-list': 'listaResultados',
          'ais-Hits-item': 'resultado',
        }"
      >
        <template v-slot:item="{ item }">
          <div class="campoImagen" v-if="item.imagen">
            <NuxtLink :to="`/obras/${item.registro}`" @click.native="salir">
              <img class="imagen" :src="urlImagen(item.imagen, 'galeria')" :alt="item.titulo" />
            </NuxtLink>
          </div>

          <div class="campos">
            <div v-for="campo in campos" :key="`campo${campo[0]}`" class="campo">
              <p v-if="item._highlightResult[campo[0]]">
                <span class="titulo">{{ campo[1] }}: </span>
                <span
                  class="texto"
                  v-if="item._highlightResult && item._highlightResult[campo[0]].value"
                  v-html="item._highlightResult[campo[0]].value"
                ></span>
              </p>
            </div>
          </div>
        </template>
      </ais-hits>
      <ais-pagination />
    </ais-instant-search>
  </ClientOnly>
</template>

<style lang="scss" scoped>
#buscador {
  position: fixed;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: rgba($dolor, 0.75);

  :deep(.buscadorContenedor) {
    width: 80vw;
    margin: 2em auto 1em auto;
  }

  :deep(.buscadorFormulario) {
    position: relative;
    display: block;
  }

  :deep(.buscadorElemento) {
    border: 3px solid transparent;
    border-radius: 10px;
    width: 100%;
    height: 50px;
    justify-content: center;
    background-color: #e9dede;
    padding-left: 30px;
    transition: all 0.3s ease-in-out;

    &:focus {
      outline: none;
      background-color: #faf5ec;
    }
  }

  :deep(.buscadorEnviar) {
    position: absolute;
    left: 10px;
    top: 15px;
    .buscadorIcono {
      width: auto;
      height: 18px;
      fill: rgb(103, 104, 104);
    }
  }

  :deep(.buscadorBorrar) {
    display: none;
  }
}

#resultados {
  width: 80vw;
  height: calc(100vh - 180px);
  overflow: auto;
  margin: 0 auto;
  background-color: var(--claridad);
}

:deep(.listaResultados) {
  padding: 2em;
}

:deep(.resultado) {
  display: flex;
  margin-bottom: 1em;

  .campoImagen {
    margin-right: 2em;

    .imagen {
      width: 220px;
      height: auto;
      color: var(--amarilloJengibre);
      border: 20px solid;
      transition: color 0.25s ease-out;

      &:hover {
        color: var(--verdeEsmeralda3);
      }
    }
  }

  .campos {
    flex: 1;
    font-size: 0.85em;
    border-bottom: 2px solid $dolor;
    padding-bottom: 1em;

    .titulo {
      font-weight: bold;
      font-family: var(--fuenteMenu);
    }
  }
}

mark {
  background-color: yellow;
}

:deep(.contenedorPaginas) {
  width: 80vw;
  margin: 0 auto;
  background-color: var(--claridad);
  padding: 1em 0;
}

:deep(.listaPaginas) {
  display: flex;
  flex-direction: row;
  justify-content: center;

  .pagina {
    border: 1px solid;
    margin: 0 0.3em 0 0.3em;

    a {
      padding: 0.3em;
    }

    &:hover,
    &.paginaActual {
      background-color: rgba($dolor, 0.7);

      a,
      a:link {
        color: $claridad;
      }
    }

    &.paginaDesabilitada {
      opacity: 0.1;
    }
  }
}

#botonCerrar {
  font-family: var(--fuenteMenu);
  color: $claridad;
  z-index: 99;
  position: fixed;
  font-size: 2em;
  right: 1vw;
  top: 0.8em;
  cursor: pointer;
  transition: opacity 0.25s ease-in-out;

  &:hover {
    opacity: 0.7;
  }
}

// Teléfonos horizontal
@media (min-width: $minCelular) {
}
// Pantallas medianas (Tablets)
@media (min-width: $minTablet) {
  #botonCerrar {
    right: 5vw;
  }
}
// Dispositivos grandes y pantallas medianas
@media (min-width: $minPantalla) {
}
// Pantallas grandes
@media (min-width: $minPantallaGrande) {
}
</style>
