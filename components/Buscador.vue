<script setup>
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch';
import { urlImagen } from '~~/utilidades/ayudas';
const clienteBuscador = instantMeiliSearch('http://localhost:7700', '1234');

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
</script>

<template>
  <ClientOnly>
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
          <div class="campoImagen" v-if="item._snippetResult.imagen">
            <img class="imagen" :src="urlImagen(item['imagen'], 'galeria')" :alt="item['titulo']" />
          </div>

          <div v-for="campo in campos" :key="`campo${campo[0]}`" class="campo">
            <div v-if="item._snippetResult[campo[0]]">
              <span class="titulo">{{ campo[1] }}: </span>
              <ais-highlight :hit="item" :attribute="campo[0]" />
            </div>
          </div>
        </template>
      </ais-hits>
      <ais-configure :attributesToSnippet="['sintesis:20']" :snippetEllipsisText="'...'" />
    </ais-instant-search>
  </ClientOnly>
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
  top: $altoEncabezado;
  left: 20vw;
  padding: 2em;
  width: 60vw;
  height: 80vh;
  overflow: auto;
  background-color: var(--verdeEsmeralda2);
}

mark {
  background-color: yellow;
}

.imagen {
  height: 50px;
  width: auto;
}
</style>
