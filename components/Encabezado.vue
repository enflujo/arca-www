<script setup lang="ts">
import { usarGeneral } from '@/cerebros/general';
import { MENU_PRINCIPAL, seccionDeRuta } from '~/utilidades/menu';

const general = usarGeneral();
const ruta = useRoute();

// Menú del rediseño (5 entradas). La entrada activa es la de la sección de la página actual.
const seccionActual = computed(() => seccionDeRuta(ruta.path));

// En el inicio el encabezado va transparente sobre la imagen del hero y se vuelve oscuro al desplazarse.
const desplazado = ref(false);
const sobreImagen = computed(() => ruta.path === '/' && !desplazado.value && !menuAbierto.value);

/**
 * Menú de celular y tableta (menos de 992 px): un botón ☰ abre un panel con las 5 secciones y, debajo de la
 * sección actual, sus páginas (en la Colección, agrupadas en datos básicos, de análisis y de gestos).
 */
const menuAbierto = ref(false);
const gruposActuales = computed(() => gruposDeSeccion(seccionActual.value));

function alternarMenu() {
  menuAbierto.value = !menuAbierto.value;
}

watch(
  () => ruta.fullPath,
  () => (menuAbierto.value = false)
);

watch(menuAbierto, (abierto) => {
  if (import.meta.client) document.body.style.overflow = abierto ? 'hidden' : '';
});

function revisarDesplazamiento() {
  desplazado.value = window.scrollY > 40;
}

function teclaEscape(evento: KeyboardEvent) {
  if (evento.key === 'Escape') menuAbierto.value = false;
}

onMounted(() => {
  revisarDesplazamiento();
  window.addEventListener('scroll', revisarDesplazamiento, { passive: true });
  window.addEventListener('keydown', teclaEscape);
});

onUnmounted(() => {
  window.removeEventListener('scroll', revisarDesplazamiento);
  window.removeEventListener('keydown', teclaEscape);
  if (import.meta.client) document.body.style.overflow = '';
});
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

    <button
      type="button"
      class="botonMenuMovil"
      :class="{ abierto: menuAbierto }"
      :aria-expanded="menuAbierto"
      aria-controls="menuMovil"
      :aria-label="menuAbierto ? 'Cerrar menú' : 'Abrir menú'"
      @click="alternarMenu"
    >
      <span></span><span></span><span></span>
    </button>
  </header>

  <!-- Panel del menú en celular y tableta -->
  <nav v-show="menuAbierto" id="menuMovil" aria-label="Menú del sitio">
    <ul class="secciones">
      <li v-for="entrada in MENU_PRINCIPAL" :key="entrada.ruta">
        <NuxtLink
          :to="entrada.ruta"
          :external="entrada.externo"
          class="seccion"
          :class="{ activo: entrada.seccion === seccionActual }"
          :aria-current="entrada.seccion === seccionActual ? 'page' : undefined"
        >
          {{ entrada.titulo }}
        </NuxtLink>

        <div v-if="entrada.seccion === seccionActual && gruposActuales.length" class="subpaginas">
          <div v-for="(grupo, i) in gruposActuales" :key="grupo.titulo ?? i" class="grupo">
            <p v-if="grupo.titulo" class="tituloGrupo">{{ grupo.titulo }}</p>
            <NuxtLink
              v-for="opcion in grupo.opciones"
              :key="opcion.slug"
              :to="`/${opcion.slug}`"
              class="subpagina"
              :class="{ activo: esPaginaActual(ruta.path, opcion.slug) }"
            >
              {{ opcion.titulo }}
            </NuxtLink>
          </div>
        </div>
      </li>
    </ul>
  </nav>
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
  z-index: 11;
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
  font-size: 1.8em;
  letter-spacing: 0.04em;
}

.lema {
  display: none;
  font-family: var(--fuenteSerif);
  font-style: italic;
  font-size: 1em;
  color: var(--oro);
}

#menuPrincipal {
  display: none;
  align-items: center;
  gap: 1.6em;
  flex: 1 1 auto;
  min-width: 0;
  font-family: var(--fuenteSans);
  font-size: 0.88em;
  font-weight: 500;

  a,
  a:link {
    color: var(--sobreOscuro);
    white-space: nowrap;
    padding: 0.35em 0;

    &:hover {
      color: var(--oro);
    }

    // Sección actual en dorado, como en el diseño.
    &.activo {
      color: var(--oro);
    }
  }
}

/* ---------- Botón ☰ ---------- */
.botonMenuMovil {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 1px solid rgba(243, 233, 216, 0.28);
  border-radius: 999px;
  background: transparent;
  cursor: pointer;

  span {
    display: block;
    width: 16px;
    height: 2px;
    border-radius: 2px;
    background-color: var(--sobreOscuro);
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
  }

  &.abierto {
    border-color: var(--oro);

    span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }
  }
}

/* ---------- Panel del menú (celular y tableta) ---------- */
#menuMovil {
  position: fixed;
  top: $altoEncabezado;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  overflow-y: auto;
  padding: 12px 20px 40px;
  background-color: var(--tinta);
  font-family: var(--fuenteSans);
}

.secciones {
  display: flex;
  flex-direction: column;

  > li {
    border-bottom: 1px solid #3a2e27;
  }
}

.seccion {
  display: block;
  padding: 14px 4px;
  font-family: var(--fuenteSerif);
  font-size: 22px;

  &:link,
  &:visited {
    color: var(--sobreOscuro);
  }

  &.activo {
    color: var(--oro);
  }
}

.subpaginas {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 4px 16px 14px;
  border-left: 1px solid #5a4a3e;
  margin: 0 0 4px 6px;
}

.grupo {
  display: flex;
  flex-direction: column;
}

.tituloGrupo {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--oro);
}

.subpagina {
  padding: 6px 0;
  font-size: 14px;

  &:link,
  &:visited {
    color: #d8c9b2;
  }

  &.activo {
    color: var(--oro);
    font-weight: 700;
  }
}

/* ---------- Tamaños ---------- */
@media (max-width: #{$minTablet - 1px}) {
  #encabezado {
    gap: 0.7em;
  }

  .marca {
    font-size: 1.6em;
  }

  // El buscador se empuja a la derecha junto al botón ☰.
  .nombreProyecto {
    margin-right: auto;
  }
}

@media (max-width: #{$minPantalla - 1px}) {
  .nombreProyecto {
    margin-right: auto;
  }
}

// Desde 992 px el menú va completo en el encabezado y el botón ☰ desaparece.
@media (min-width: $minPantalla) {
  #encabezado {
    padding: 0 2.5em;
  }

  #menuPrincipal {
    display: flex;
  }

  .botonMenuMovil,
  #menuMovil {
    display: none !important;
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
