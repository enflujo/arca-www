<template>
  <div :class="`menuPrincipal ${menuAbierto ? 'abierto' : 'cerrado'}`">
    <!-- <nav class="menuContenido" :style="`background-color:${colorFondo}`">
    TODO: cambiar de hardcodeado a el CMS -->
    <nav class="menuContenido">
      <NuxtLink
        v-for="pagina in paginas"
        :key="pagina.slug"
        :to="`/${pagina.slug}`"
        class="navBtn"
        @click.native="resolverMenu"
      >
        {{ pagina.titulo }}
      </NuxtLink>
    </nav>

    <!-- <div class="menuBtn" :style="`background-color:${colorFondo}`" @click="resolverMenu">
    TODO: MODIFICAR EL HARDCODEO -->
    <div class="menuBtn" @click="resolverMenu">
      <div class="botonMenu"><span class="menuRaya"></span></div>
      <!-- <span class="lineaVertical"></span> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    colorFondo: {
      type: String,
      default: '#08173E',
    },

    menuAbierto: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    paginas() {
      return this.$store.state.general.menus.principal;
    },
  },

  methods: {
    resolverMenu() {
      this.$emit('resolverMenu');
    },
  },
};
</script>

<style lang="scss" scoped>
@use "sass:color";
$menuRayaAncho: 30px;
$menuRayaAlto: 2px;
$menuRayaRadio: 2px;
$menuRayaEspacio: 8px;
$menuRayaColor: #08173e;

.menuPrincipal {
  z-index: 9999;
}

.menuBtn {
  position: fixed;
  background-color: #08173e;
}

.botonMenu {
  width: $tamanoMenu;
  height: $tamanoMenu;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.menuContenido {
  height: 0;
  width: 0;
  position: absolute;
  right: 0;
  padding: 0;
  top: 0;
  text-align: center;
  font-size: 0;
  color: $profundidad;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: $claridad;

  a,
  a:link {
    color: $profundidad;
    opacity: 0.4;
    padding: 0.3em 1em 0.7em 0.3em;
    margin-bottom: 0.5em;
    background-repeat: no-repeat;

    &:hover {
      color: $profundidad;
      opacity: 1;
    }

    &.nuxt-link-active {
      color: $profundidad;
      opacity: 1;
    }

    &::before {
      font-size: 0.6em;
      padding-right: 0.3em;
    }
  }
}

.abierto {
  .botonMenu {
    .menuRaya {
      height: 0;
      width: 0;
      background-color: $claridad;

      &::before {
        transform: rotate(45deg) translate(-12px, 12px);
      }

      &::after {
        transform: rotate(-45deg) translate(-12px, -12px);
      }
    }
  }

  .menuContenido {
    width: 100vw;
    height: 100vh;
    padding: 60px 2em;
    font-size: 1.2em;
  }
}

.menuRaya {
  width: $menuRayaAncho;
  height: $menuRayaAlto;
  background-color: $profundidad;
  border-radius: $menuRayaRadio;
  transition: all 0.2s ease-in-out;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: $menuRayaAncho;
    height: $menuRayaAlto;
    background-color: $menuRayaColor;
    border-radius: $menuRayaRadio;
    transition: all 0.5s ease-in-out;
  }

  &::before {
    transform: translate(0, -$menuRayaEspacio);
  }

  &::after {
    transform: translate(0, $menuRayaEspacio);
  }
}

// Teléfonos horizontal
@media (min-width: $minCelular) {
}

// Pantallas medianas (Tablets)
@media (min-width: $minTablet) {
  .menuBtn {
    width: $tamanoMenu;
    height: $tamanoMenu;
    right: 0;
    top: 0;
    cursor: pointer;
    background-color: $claridad;
    border-radius: 100% 0% 0% 100% / 0% 25% 75% 100%;
  }

  .abierto {
    .menuContenido {
      width: 15vw;
      right: 0;
    }
  }
}

// Dispositivos grandes y pantallas medianas
@media (min-width: $minPantalla) {
  .abierto {
    .menuContenido {
      width: 400px;
    }
  }
}

// Pantallas grandes
@media (min-width: $minPantallaGrande) {
  .abierto {
    .menuContenido {
      width: 30vw;
      font-size: 1.5em;
      border-radius: 100% 0% 0% 100% / 50% 0% 100% 50%;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
