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

onMounted(() => {
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

function escala(numObras, min, maximo, maxBase = max.value) {
  return convertirEscala(numObras, 1, maxBase, min, maximo);
}

const datosSubcategoria = (datos, indice) => {
  switch (indice) {
    case 1:
      return datos.categorias2 ? datos.categorias2 : [];
    case 2:
      return datos.categorias2;
  }
  return [];
};
</script>

<template>
  <div class="contenedor">
    <div class="contenedorNivel1" v-for="categoria1 in props.datos">
      <span
        class="nombre nombreNivel1"
        :data-slug="categoria1.slug"
        :style="`font-size:${escala(categoria1.numObras, 1, 6)}em`"
      >
        {{ categoria1.nombre }}
      </span>

      <div class="contenedorSubNivel" v-for="nivel in categoria1.arbol">
        <span
          class="nombre"
          v-for="subCategoria in nivel"
          :style="`font-size:${escala(subCategoria.numObras, 1, 6, max / 2)}em`"
        >
          <span
            class="circulo"
            :style="`width:${escala(subCategoria.numObras, 5, 20, max / 2)}px;height:${escala(
              subCategoria.numObras,
              5,
              20,
              max / 2
            )}px`"
          ></span>
          <span>{{ subCategoria.nombre }}</span>
        </span>
      </div>
    </div>
  </div>

  <!-- <div id="nivel2" class="contenedorNivel">
    <div class="subNivel" v-for="categoria1 in props.datos">
      <div class="categoriaNivel2" v-if="categoria1.categorias2" v-for="categoria2 in categoria1.categorias2">
        <span class="nombre" :data-pariente="categoria1.slug" :style="escala(categoria2.numObras)">
          {{ categoria2.nombre }}
        </span>
      </div>
    </div>
  </div> -->
</template>

<style lang="scss" scoped>
.contenedor {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
}
.contenedorNivel1 {
  padding: 1em;
  display: flex;
  flex: 1;
  justify-content: space-around;
  transform-origin: 0 0;
  transition: all 0.5s ease-in-out;

  // &:hover {
  //   font-size: 3rem;
  // }
}

.contenedorSubNivel {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.nombreNivel1 {
  flex: 1;
}

.nombre {
  position: relative;
  display: inline-block;
}
.circulo {
  display: block;
  background-color: hotpink;
  border-radius: 50%;

  position: absolute;
  left: -1em;
}
</style>
