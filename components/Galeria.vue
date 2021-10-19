<template>
  <div class="todas-images">
    <div v-for="(obra, i) in obras" :key="`obra-${i}`" class="imagen">
      <nuxt-link :to="`/imagen/${obra.id}`"
        ><img :src="urlImagen(obras[i].image)" :alt="obras.title" />
        <div class="informacion-hover">
          <h2 class="nombre-obra-hover">{{ obra.title }}</h2>
          <h3 class="nombre-autor-hover">{{ obra.author_id.name }} {{ obra.author_id.lastname }}</h3>
          <p class="descripcion-hover">{{ obra.synthesis.substr(0, 70) + '\u2026' }}</p>
          <h3 class="boton-detalles">DETALLES -></h3>
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
.imagenes {
  width: 80vw;

  img {
    width: 160%;
    height: auto;
  }

  .caja-inicial {
    display: flex;
    justify-content: space-between;
    .caja-descripcion {
      height: auto;
      display: flex;
      flex-direction: row;
      text-align: initial;
      .descripcion {
        width: 400px;
        background-color: #af2828;
        padding: 2em;
        justify-content: space-around;
        display: flex;
        flex-direction: column;
        .titulo-obra {
          color: $claridad;
          font-weight: 300;
        }
        .subtitulo-obra {
          color: $claridad;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 5px;
        }
        .descripcion-obra {
          color: $claridad;
          line-height: 1.5;
          letter-spacing: -0.4px;
          font-size: 14px;
        }
        .boton-ver {
          border: 1px solid $claridad;
          padding: 1em;
          border-radius: 25px;
          color: $claridad;
          letter-spacing: 6px;
          letter-spacing: 6px;
          font-size: 11px;
          align-self: center;
        }
      }
    }
  }

  .caja-secundaria {
    display: flex;
    justify-content: space-between;
    top: 20px;
    position: relative;
  }
}
.todas-images {
  display: grid;
  width: 95%;
  height: calc(100vh - 140px);
  grid-gap: 10px;
  padding: 10px;
  grid-template-columns: repeat(auto-fill, minmax(20%, 1fr));
  grid-auto-rows: minmax(32.8%, auto);
  grid-auto-flow: dense;
  overflow: hidden;
  .imagen {
    border-radius: 10px;
    overflow: hidden;
    a {
      position: relative;
      display: block;
      width: 100%;
      min-height: 100%;
    }
  }

  .informacion-hover {
    position: absolute;
    color: $claridad !important;
    padding: 20px;
    opacity: 0;
    background-color: $dolor;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    text-transform: none;
    z-index: 999999;

    .nombre-obra-hover {
      color: $claridad;
      letter-spacing: 0;
      font-size: 1.4em;
    }
    .nombre-autor-hover {
      color: $claridad;
      letter-spacing: 0;
      font-size: 1.1em;
      font-weight: 400;
      position: relative;
      top: 8px;
    }
    .descripcion-hover {
      letter-spacing: 0;
      margin-top: 10px;
      line-height: 1.5;
      font-size: 0.8em;
      font-weight: 200;
      position: relative;
      top: 10px;
    }
  }
  .informacion-hover:hover {
    opacity: 0.95;
    transition: 0.5s;
  }
  .boton-detalles {
    font-weight: 500;
    font-size: 0.75em;
    position: relative;
    top: 20px;
    text-align: flex-end;
  }
}
</style>
