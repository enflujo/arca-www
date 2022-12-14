<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos } from '~~/utilidades/ayudas';

const cargando = ref(true);
const categorias = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador' });

onMounted(async () => {
  function aplanarCategorias(datosCategoria, siguienteCategoria) {
    const respuesta = {
      nombre: datosCategoria.nombre,
      slug: datosCategoria.slug,
      numObras: datosCategoria.obras_func.count,
      ancestro: datosCategoria.ancestro ? datosCategoria.ancestro.slug : null,
    };

    if (siguienteCategoria <= 6) {
      const siguienteNivel = `categorias${siguienteCategoria}`;

      if (datosCategoria[siguienteNivel] && datosCategoria[siguienteNivel].length) {
        const nivel = siguienteCategoria + 1;
        respuesta[siguienteNivel] = datosCategoria[siguienteNivel].map((categoria) => {
          return aplanarCategorias(categoria, nivel);
        });
      }
    }

    return respuesta;
  }

  const Categorias = gql`
    query {
      categorias1 {
        nombre
        slug
        obras_func {
          count
        }
        categorias2 {
          nombre
          slug
          ancestro {
            slug
          }
          obras_func {
            count
          }
          categorias3 {
            nombre
            slug
            ancestro {
              slug
            }
            obras_func {
              count
            }
            categorias4 {
              nombre
              slug
              ancestro {
                slug
              }
              obras_func {
                count
              }
              categorias5 {
                nombre
                slug
                ancestro {
                  slug
                }
                obras_func {
                  count
                }
                categorias6 {
                  nombre
                  slug
                  ancestro {
                    slug
                  }
                  obras_func {
                    count
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const { categorias1 } = await obtenerDatos(Categorias);

  categorias.value = categorias1.map((categoria1) => {
    return aplanarCategorias(categoria1, 2);
  });

  cerebroArchivo.paginaActual = 'categorias';
  cargando.value = false;
});
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
