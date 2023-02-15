<script setup>
const convertirEscala = (valor, escalaBaseMin, escalaBaseMax, escalaDestinoMin, escalaDestinoMax) => {
  return (
    ((valor - escalaBaseMin) * (escalaDestinoMax - escalaDestinoMin)) / (escalaBaseMax - escalaBaseMin) +
    escalaDestinoMin
  );
};
const props = defineProps({
  datos: Array,
  default: [],
});
const max = ref(0);
const datosColumnas = ref([]);
const contenedores = ref();
const contenedor = ref();
const datosSvgs = ref([[], [], [], [], []]);
const dims = ref(null);

onBeforeMount(() => {
  let calculoMax = 0;

  props.datos.forEach((categoria1) => {
    const matriz = [[], [], [], [], []];
    calculoMax = categoria1.numObras > calculoMax ? categoria1.numObras : calculoMax;

    if (categoria1.categorias2) {
      categoria1.categorias2.forEach((categoria2) => {
        matriz[0].push(categoria2);

        if (categoria2.categorias3) {
          categoria2.categorias3.forEach((categoria3) => {
            matriz[1].push(categoria3);

            if (categoria3.categorias4) {
              categoria3.categorias4.forEach((categoria4) => {
                matriz[2].push(categoria4);

                if (categoria4.categorias5) {
                  categoria4.categorias5.forEach((categoria5) => {
                    matriz[3].push(categoria5);

                    if (categoria5.categorias6) {
                      categoria5.categorias6.forEach((categoria6) => {
                        matriz[4].push(categoria6);
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }

    categoria1.arbol = matriz;
  });
  max.value = calculoMax;
});

onMounted(() => {
  actualizarLineas();
});

function escala(numObras, min, maximo, maxBase = max.value) {
  return convertirEscala(numObras, 1, maxBase, min, maximo);
}

function actualizarLineas() {
  // const { width: ancho, height: alto, x, y } = contenedor.value.getBoundingClientRect();
  // // salir si el contenedor aún no tiene alto, esto significa que aún esta pintando en las posiciones que se necesitan a continuación.
  // if (alto === 0) return;
  // dims.value = { ancho, alto };
  // contenedores.value.forEach((contenedor) => {
  //   const subNiveles = contenedor.querySelectorAll('.contenedorSubNivel');
  //   subNiveles.forEach((nivel, i) => {
  //     const elementos = nivel.querySelectorAll('.elementoLista .circulo');
  //     elementos.forEach((nodo) => {
  //       const dimsAncestro = contenedor
  //         .querySelector(`[data-fuente="${nodo.dataset.ancestro}"]`)
  //         .getBoundingClientRect();
  //       const dimsNodo = nodo.getBoundingClientRect();
  //       const x1 = dimsAncestro.x - x + dimsAncestro.width / 2;
  //       const y1 = dimsAncestro.y - y + dimsAncestro.height / 2;
  //       const x2 = dimsNodo.x - x + dimsNodo.width / 2;
  //       const y2 = dimsNodo.y - y + dimsNodo.height / 2;
  //       datosSvgs.value[i].push({ x1, y1, x2, y2 });
  //     });
  //   });
  // });
}
</script>

<template>
  <div class="contenedor" ref="contenedor">
    <svg id="lineas" v-if="dims" :width="dims.ancho" :height="dims.alto">
      <g v-for="(columna, i) in datosSvgs" :key="`columna-${i}`">
        <line
          class="linea"
          v-for="(nodo, i) in columna"
          :key="`linea-${i}`"
          :x1="nodo.x1"
          :y1="nodo.y1"
          :x2="nodo.x2"
          :y2="nodo.y2"
        ></line>
      </g>
    </svg>
    <div class="contenedorNivel1" v-for="(categoria1, i) in props.datos" ref="contenedores" :key="i">
      <span class="elementoLista nombreNivel1" :style="`font-size:${escala(categoria1.numObras, 0.8, 2)}em`">
        <span
          class="circulo"
          :style="`width:${escala(categoria1.numObras, 5, 50, max / 6)}px;height:${escala(
            categoria1.numObras,
            5,
            50,
            max / 6
          )}px`"
          :data-fuente="categoria1.slug"
        ></span>
        <NuxtLink :to="`/archivo/categorias1/${categoria1.id}`"
          ><span class="nombre">{{ categoria1.nombre }}</span></NuxtLink
        >
      </span>

      <div class="contenedorSubNivel" v-for="(nivel, i) in categoria1.arbol" :key="nivel">
        <span class="elementoLista" v-for="subCategoria in nivel" :key="subCategoria">
          <span
            class="circulo"
            :data-ancestro="subCategoria.ancestro"
            :data-fuente="subCategoria.slug"
            :style="`width:${escala(subCategoria.numObras, 5, 50, max / 6)}px;height:${escala(
              subCategoria.numObras,
              5,
              50,
              max / 6
            )}px`"
          ></span>
          <!--¿Vamos armando la cadena de categorías o solo el primer y último nivel?-->
          <NuxtLink :to="`/archivo/categorias${i + 2}/${subCategoria.id}`"
            ><span class="nombre" v-if="subCategoria.numObras > 0">
              {{ subCategoria.nombre }} ({{ subCategoria.numObras }})
            </span></NuxtLink
          >
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contenedor {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  position: relative;

  svg {
    position: absolute;
    top: 0;
    z-index: 2;
    pointer-events: none;

    .linea {
      stroke: rgb(236, 85, 20);
      stroke-width: 1;
    }
  }
}

.contenedorNivel1 {
  padding: 1em;
  display: flex;
  flex: 1;
  justify-content: space-around;
  transform-origin: 0 0;
  transition: all 0.5s ease-in-out;
  position: relative;
}

.contenedorSubNivel {
  display: flex;
  flex-direction: column;
  flex: 1;
  // padding: 0 2em;
}

.nombreNivel1 {
  flex: 1;
}

.elementoLista {
  position: relative;
  display: inline-block;
}

.nombre {
}

.circulo {
  display: inline-block;
  background-color: hotpink;
  border-radius: 50%;

  // position: absolute;
  top: 0;
}
</style>
