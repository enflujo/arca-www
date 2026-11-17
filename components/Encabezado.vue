<script setup lang="ts">
import { usarGeneral } from '@/cerebros/general';
import { MENU_PRINCIPAL, seccionDeRuta } from '~/utilidades/menu';

const general = usarGeneral();

// Menú del rediseño (5 entradas). La entrada activa es la de la sección de la página actual.
const seccionActual = computed(() => seccionDeRuta(ruta.path));

// En el inicio el encabezado va transparente sobre la imagen del hero y se vuelve oscuro al desplazarse.
const ruta = useRoute();
const desplazado = ref(false);
const sobreImagen = computed(() => ruta.path === '/' && !desplazado.value);

function revisarDesplazamiento() {
  desplazado.value = window.scrollY > 40;
}

onMounted(() => {
  revisarDesplazamiento();
  window.addEventListener('scroll', revisarDesplazamiento, { passive: true });
});

onUnmounted(() => window.removeEventListener('scroll', revisarDesplazamiento));
</script>

<template>
  <header id="encabezado" :class="{ sobreImagen }">
    <NuxtLink
      class="nombreProyecto"
      :to="'/'"
      :aria-label="`${general.titulo || 'ARCA'} · Arte Colonial Americano, inicio`"
    >
      <span class="marca">ARCA</span>
      <span class="lema">Arte Colonial Americano</span>
    </NuxtLink>

    <nav id="menuPrincipal" aria-label="Menú principal">
      <NuxtLink
        v-for="entrada in MENU_PRINCIPAL"
        :key="entrada.ruta"
        :to="entrada.ruta"
        :external="entrada.externo"
        :class="{ activo: entrada.seccion === seccionActual }"
        :aria-current="entrada.seccion === seccionActual ? 'page' : undefined"
      >
        {{ entrada.titulo }}
      </NuxtLink>
    </nav>

    <BuscadorBoton />
  </header>
</template>

<style lang="scss" scoped>
#encabezado {
  height: $altoEncabezado;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 1em;
  background-color: var(--tinta);
  border-bottom: 1px solid rgba(243, 233, 216, 0.16);
  color: var(--sobreOscuro);
  z-index: 8;
  display: flex;
  align-items: center;
  gap: 1.5em;
  transition: background-color 0.3s ease;

  &.sobreImagen {
    background-color: transparent;
  }
}

.nombreProyecto {
  display: flex;
  align-items: baseline;
  gap: 0.6em;
  flex-shrink: 0;
  line-height: 1;

  &:link,
  &:visited,
  &:hover {
    color: var(--sobreOscuro);
  }

  &:hover {
    opacity: 0.85;
  }
}

.marca {
  font-family: var(--fuenteSerif);
  font-size: 2em;
  letter-spacing: 0.04em;
}

.lema {
  display: none;
  font-family: var(--fuenteSerif);
  font-style: italic;
  font-size: 1.05em;
  color: var(--oro);
}

#menuPrincipal {
  display: flex;
  align-items: center;
  gap: 1.6em;
  flex: 1 1 auto;
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
  font-family: var(--fuenteSans);
  font-size: 0.92em;
  font-weight: 500;

  &::-webkit-scrollbar {
    display: none;
  }

  a,
  a:link {
    color: var(--sobreOscuro);
    white-space: nowrap;
    padding: 0.35em 0;
    border-bottom: 1px solid transparent;

    &:hover {
      color: var(--oro);
    }

    // Sección actual en dorado, como en el diseño.
    &.activo {
      color: var(--oro);
    }
  }
}

// En pantallas pequeñas el menú se desplaza horizontalmente y el buscador queda como ícono.
@media (max-width: #{$minTablet - 1px}) {
  #encabezado {
    gap: 1em;
  }

  .marca {
    font-size: 1.7em;
  }
}

@media (min-width: $minPantalla) {
  #encabezado {
    padding: 0 2.5em;
  }
}

// En pantallas anchas: lema visible, menú centrado y espaciado como en el diseño.
@media (min-width: $minPantallaGrande) {
  #encabezado {
    padding: 0 3.5em;
    gap: 1.75em;
  }

  .lema {
    display: block;
  }

  #menuPrincipal {
    justify-content: center;
    gap: 2em;
  }
}
</style>
