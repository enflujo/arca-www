<script setup>
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { urlImagen } from '~~/utilidades/ayudas';
const clienteBuscador = instantMeiliSearch('http://localhost:7700', '1234');
</script>

<template>
  <ais-instant-search id="buscador" :search-client="clienteBuscador" index-name="obras">
    <ais-search-box
      placeholder="Buscar..."
      reset-title="Borrar"
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

    <ais-hits id="resultado">
      <template v-slot:item="{ item }">
        <div class="titulo" v-if="item._snippetResult.titulo">
          <img class="imagen" :src="urlImagen(item['imagen'], 'galeria')" :alt="item['imagen']" />
          <span>Título: </span>
          <ais-highlight :hit="item" attribute="titulo" />
        </div>

        <div class="titulo" v-if="item._snippetResult.descripcion">
          <span>Descripción: </span>
          <ais-highlight :hit="item" attribute="descripcion" />
        </div>

        <div class="sintesis">
          <span>Síntesis: </span>
          <ais-highlight :hit="item" attribute="sintesis" />
        </div>

        <ul class="categorias">
          <li v-if="item._snippetResult['categoria1.nombre']">
            <span>Categoria 1: </span>
            <span v-html="item._snippetResult['categoria1.nombre'].value"></span>
          </li>
        </ul>

        <ul class="ubicaciones">
          <li v-if="item._snippetResult['categoria2.nombre']">
            <span>Ubicación: </span>
            <span v-html="item._snippetResult['ubicacion.nombre'].value"></span>
          </li>
        </ul>

        <i>{{ JSON.stringify(item, null, 2) }}</i>
      </template>
    </ais-hits>
    <ais-configure :attributesToSnippet="['sintesis:20']" :snippetEllipsisText="'...'" />
  </ais-instant-search>
</template>

<style lang="scss" scoped>
#buscador {
  position: relative;
  :deep(.buscadorElemento) {
    border: 3px solid transparent;
    border-radius: 18px;
    width: 200px;
    height: 30px;
    justify-content: center;
    background-color: #faf5ec;
    padding-left: 30px;
    transition: all 0.3s ease-in-out;
    &:focus {
      outline: none;
      border: 3px solid yellow;
    }
  }
  :deep(.buscadorEnviar) {
    position: absolute;
    left: 10px;
    top: 8px;
    .buscadorIcono {
      width: auto;
      height: 14px;
      fill: rgb(103, 104, 104);
    }
  }
}
#resultado {
  position: fixed;
}
mark {
  background-color: yellow;
}
.imagen {
  height: 50px;
  width: auto;
}
</style>
