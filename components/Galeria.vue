<template>
  <div class="galeria">
    <div v-for="(obra, i) in obras" :key="`obra-${i}`" class="imagen">
      <nuxt-link :to="`/imagen/${obra.arca_id}`">
        <img :src="urlImagen(obras[i].imagen)" :alt="obras[i].titulo" />

        <div class="informacion-hover">
          <h2 v-if="obra.titulo.length > 40" class="nombre-obra-hover">{{ obra.titulo.substr(0, 30) + '\u2026' }}</h2>
          <h2 v-else class="nombre-obra-hover">{{ obra.titulo }}</h2>
          <h3 class="nombre-autor-hover">{{ obra.autor.nombre }} {{ obra.autor.apellido }}</h3>
          <div class="pais-hover">
            <p v-if="obra.ubicacion_actual.nombre != null">Ubicación actual: {{ obra.ubicacion_actual.nombre }}</p>
            <span class="fecha-hover">
              {{ obra.fechas_actividad }}
            </span>
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { urlImagen } from '../utilidades/ayudas';
export default {
  props: {
    obras: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    urlImagen(objImg, key) {
      return objImg && objImg.id ? urlImagen(objImg.id, key) : '';
    },
  },
};
</script>

<style lang="scss" scoped>
.galeria {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  // display: grid;
  // height: calc(100vh - 140px);
  // grid-gap: 10px;
  // padding: 10px;
  // grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
  // grid-auto-rows: minmax(32.8%, auto);
  // grid-auto-flow: dense;

  .imagen {
    // border-radius: 10px;
    // overflow: hidden;
    // a {
    //   position: relative;
    //   display: block;
    //   width: 100%;
    //   min-height: 100%;
    // }
  }

  .informacion-hover {
    // position: absolute;
    // color: $claridad !important;
    // padding: 20px;
    // opacity: 0;
    // background-color: $dolor;
    // width: 100%;
    // height: 100%;
    // left: 0;
    // top: 0;
    // text-transform: none;
    // z-index: 9;
    // .nombre-obra-hover {
    //   color: $claridad;
    //   letter-spacing: 0;
    //   font-size: 1.4em;
    //   font-family: $fuentePrincipal;
    // }
    // .nombre-autor-hover {
    //   color: $claridad;
    //   letter-spacing: 0;
    //   font-size: 1em;
    //   font-weight: 350;
    //   position: relative;
    //   top: 8px;
    // }
    // .pais-hover {
    //   letter-spacing: 0;
    //   margin-top: 10px;
    //   line-height: 1.6;
    //   font-size: 0.8em;
    //   font-weight: 100;
    //   position: relative;
    //   top: 0px;
    // }
    // .fecha-hover {
    //   letter-spacing: 0;
    //   margin-top: 10px;
    //   line-height: 1.7;
    //   font-weight: 100;
    //   position: relative;
    //   top: 0px;
    // }
  }
  .informacion-hover:hover {
    // opacity: 0.95;
    // transition: 0.5s;
  }
  .boton-detalles {
    // font-weight: 500;
    // font-size: 0.75em;
    // position: relative;
    // top: 20px;
    // text-align: flex-end;
  }
}
</style>
