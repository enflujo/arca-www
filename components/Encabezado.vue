<script setup>
import { usarGeneral } from '@/cerebros/general';

const general = usarGeneral();
</script>

<template>
  <div id="encabezado">
    <NuxtLink class="nombreProyecto" :to="'/'">
      <Logo class="logoArca" />
      <span id="titulo">{{ general.titulo }}</span>
    </NuxtLink>

    <nav id="menuPrincipal">
      <NuxtLink v-for="pagina in general.menus.principal" :key="`pagina${pagina.slug}`" :to="`/${pagina.slug}`">
        {{ pagina.titulo }}
      </NuxtLink>
    </nav>

    <BuscadorBoton />
  </div>
</template>

<style lang="scss" scoped>
#encabezado {
  height: $altoEncabezado;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  background-color: rgba($color: $dolor, $alpha: 0.85);
  color: $claridad;
  z-index: 8;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}

.logoArca {
  fill: $claridad;
  height: 0.8em;
}

#titulo {
  display: none;
}

.nombreProyecto {
  display: flex;
  align-items: center;
  font-size: 2em;
  font-family: var(--fuentePrincipal);
  font-weight: bold;
  margin-left: 0.3em;
  color: var(--mediana);
  letter-spacing: 0.15em;
  text-transform: uppercase;

  &:hover {
    opacity: 0.85;
    color: var(--mediana); // mantener el color para que no cambie al predeterminado en todos los enlaces.
  }
}

#menuPrincipal {
  margin-left: 2em;
  display: flex;

  a,
  a:link {
    border-bottom: 1px solid transparent;
    margin-right: 1em;
    font-family: var(--fuenteMenu);
    color: $claridad;

    &:hover {
      border-bottom: 1px dotted;
    }

    &.router-link-active {
      border-bottom: 1px solid;
    }
  }
}

// Pantallas medianas (Tablets)
@media (min-width: $minTablet) {
  .logoArca {
    padding-right: 0.3em;
  }

  #titulo {
    display: block;
  }
}

// Dispositivos grandes y pantallas medianas
@media (min-width: $minPantalla) {
}

// Pantallas grandes
@media (min-width: $minPantallaGrande) {
}

//Pantallas gigantes
@media (min-width: $minPantallaGigante) {
}
</style>
