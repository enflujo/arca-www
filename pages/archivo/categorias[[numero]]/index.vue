<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { aplanarCategorias, gql } from '~~/utilidades/ayudas';

const cargando = ref(true);
const categorias = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true });

const camposCategoria = (nivel, respuesta) => {
  if (nivel <= 6) {
    const agregado =
      respuesta +
      `
        categorias${nivel}(limit: -1) {
          id
          nombre
          slug
          obras_func { count }
          `;
    return camposCategoria(nivel + 1, agregado);
  } else {
    return respuesta + '}}}}}}}';
  }
};
const { categorias1 } = await obtenerDatos('categorias', camposCategoria(1, 'query {'));

console.log(categorias1);
if (categorias1) {
  categorias.value = categorias1.map((categoria1) => {
    return aplanarCategorias(categoria1, 2);
  });

  cerebroArchivo.paginaActual = 'Categorías';
  cargando.value = false;
}
</script>

<template>
  <h1>Categorias</h1>
  <Cargador v-if="cargando" />

  <GraficaArbol v-else :datos="categorias" />

  <!-- <div v-if="categorias.length" class="visualizacion">
    <ul class="nivelCategoria">
      <li v-for="(categoria1, i) in categorias" :key="`categoria1${i}`">
        nivel1 - {{ categoria1.nombre }} ({{ categoria1.numObras }})

        <ul v-if="categoria1.categorias2" class="nivelCategoria">
          <li v-for="(categoria2, i) in categoria1.categorias2" :key="`categoria2${i}`">
            nivel2 - {{ categoria2.nombre }} ({{ categoria2.numObras }})

            <ul v-if="categoria2.categorias3" class="nivelCategoria">
              <li v-for="(categoria3, i) in categoria2.categorias3" :key="`categoria3${i}`">
                nivel3 - {{ categoria3.nombre }} ({{ categoria3.numObras }})

                <ul v-if="categoria3.categorias4" class="nivelCategoria">
                  <li v-for="(categoria4, i) in categoria3.categorias4" :key="`categoria4${i}`">
                    nivel4 - {{ categoria4.nombre }} ({{ categoria4.numObras }})

                    <ul v-if="categoria4.categorias5" class="nivelCategoria">
                      <li v-for="(categoria5, i) in categoria4.categorias5" :key="`categoria5${i}`">
                        nivel5 - {{ categoria5.nombre }} ({{ categoria5.numObras }})

                        <ul v-if="categoria5.categorias6" class="nivelCategoria">
                          <li v-for="(categoria6, i) in categoria5.categorias6" :key="`categoria6${i}`">
                            nivel6 - {{ categoria6.nombre }} ({{ categoria6.numObras }})
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div> -->
</template>

<style lang="scss" scoped>
ul {
  padding-left: 1em;
}
</style>
