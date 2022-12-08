<script setup>
import { usarGeneral } from '@/store/general';

const general = usarGeneral();

const props = defineProps({
  colorFondo: {
    type: String,
    default: '#08173E',
  },

  menuAbierto: {
    type: Boolean,
    default: false,
  },
});

// export default {
//   computed: {
//     paginas() {
//       return this.$store.state.general.menus.principal;
//     },
//   },

//   methods: {
//     resolverMenu() {
//       this.$emit('resolverMenu');
//     },

//     cerrarMenu() {
//       this.$emit('cerrarMenu');
//     },
//   },
// };
</script>

<template>
  <div :class="`contenedorMenu ${menuAbierto ? 'abierto' : 'cerrado'}`">
    <div v-click-outside="cerrarMenu" class="menuPrincipal">
      <nav class="menuContenido">
        <NuxtLink
          v-for="pagina in paginas"
          :key="pagina.slug"
          :to="pagina.slug ? `/${pagina.slug}` : '/'"
          class="navBtn"
          @click.native="resolverMenu"
        >
          {{ pagina.titulo }}
        </NuxtLink>
      </nav>

      <div class="menuBtn" @click="resolverMenu">
        <div class="botonMenu"><span class="menuRaya"></span></div>
      </div>
    </div>
    <div class="fondo"></div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';
$menuRayaAncho: 25px;
$menuRayaAlto: 3px;
$menuRayaRadio: 4px;
$menuRayaEspacio: 6px;
$menuRayaColor: $claridad;

.contenedorMenu {
  z-index: 9999;
  position: fixed;
}

.menuBtn {
  position: fixed;
  cursor: pointer;
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

.logo-texto {
  position: absolute;
  top: 25px;
  left: 25px;
  letter-spacing: 1px;
  width: 250px;
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
  background-color: $dolor;

  a,
  a:link {
    color: $claridad;
    opacity: 0.4;
    padding: 0.3em 1em 0.7em 0.3em;
    margin-bottom: 0.5em;
    background-repeat: no-repeat;

    &:hover {
      color: $claridad;
      opacity: 1;
    }

    &.nuxt-link-exact-active {
      color: $claridad;
      opacity: 1;
    }

    &::before {
      font-size: 0.6em;
      padding-right: 0.3em;
    }
  }
}

.menuPrincipal {
  z-index: 2;
  position: relative;
}

.cerrado {
  .fondo {
    opacity: 0;
  }
}

.abierto {
  .menuPrincipal {
    .botonMenu {
      .menuRaya {
        height: 0;
        width: 0;

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
      padding: 2%;
      font-size: 90%;
    }
  }

  .fondo {
    opacity: 1;
  }
}

.menuRaya {
  width: $menuRayaAncho;
  height: $menuRayaAlto;
  background-color: $claridad;
  border-radius: $menuRayaRadio;
  transition: all 0.2s ease-in-out;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: $menuRayaAncho;
    height: $menuRayaAlto;
    background-color: $claridad;
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
    right: 0;
    top: 0;
    width: 80px;
    height: 80px;

    &::before {
      content: '';
      border-top: 80px solid $dolor;
      border-left: 80px solid transparent;
      display: block;
      position: absolute;
    }

    .botonMenu {
      margin: -21px 0 0 14px;
    }
  }

  .abierto {
    .menuPrincipal {
      .menuBtn {
        background-color: transparent;
      }
      .menuContenido {
        width: 15vw;
        right: 0;
      }
    }
  }
}

// Dispositivos grandes y pantallas medianas
@media (min-width: $minPantalla) {
  .abierto {
    .menuPrincipal {
      .menuContenido {
        width: 400px;
      }
    }
  }
}

// Pantallas grandes
@media (min-width: $minPantallaGrande) {
  .abierto {
    .menuPrincipal {
      .menuContenido {
        width: 20vw;
        font-size: 1.1em;
        display: flex;
        justify-content: center;
        position: fixed;
      }
    }
  }
}
</style>
