<script setup lang="ts">
import { usarGeneral } from '~/cerebros/general';
import { seccionDeRuta } from '~/utilidades/menu';

const cerebro = usarGeneral();
const menuVisible = ref(false);
const ruta = useRoute();

// Rediseño 2026: área principal oscura con paneles claros en Recursos, Sobre ARCA y en los índices de la
// Colección (las páginas del menú lateral). Las galerías de obras conservan por ahora su fondo claro.
const oscuro = computed(() => {
  const seccion = seccionDeRuta(ruta.path);
  const esIndice = ruta.path.split('/').filter(Boolean).length === 1;
  return seccion === 'recursos' || seccion === 'sobre' || (seccion === 'coleccion' && esIndice);
});

if (!cerebro.datosCargados) {
  await useAsyncData('cargarGeneral', async () => {
    await cerebro.cargarGeneral();
    return true;
  });
}

if (!cerebro.relaciones.length) {
  await useAsyncData('cargarRelaciones', async () => {
    await cerebro.cargarRelaciones();
    return true;
  });
}

function abrirOCerrar(evento: MouseEvent) {
  evento.stopPropagation();
  menuVisible.value = !menuVisible.value;
}

function cerrar() {
  menuVisible.value = false;
}
</script>

<template>
  <Encabezado />

  <div id="contenedor">
    <div class="botonMenu" @click="abrirOCerrar" :class="menuVisible ? 'cerrar' : 'abrir'">
      <span class="linea linea1"></span>
      <span class="linea linea2"></span>
      <span class="linea linea3"></span>
    </div>

    <MenuArchivo id="contenedorMenu" :visible="menuVisible" :cerrar="cerrar" />

    <div id="contenido" :class="{ oscuro }">
      <Buscador v-if="cerebro.buscadorVisible" />
      <main>
        <slot />
      </main>
      <Guardaescobas :completo="false" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
#contenedor {
  color: var(--profundidad);
  display: flex;
  justify-content: flex-end;
  margin-top: $altoEncabezado;
}

#contenedorMenu {
  background-color: var(--papel);
  border-right: 1px solid var(--borde);
  box-sizing: border-box;
  top: $altoEncabezado;
  height: calc(100vh - #{$altoEncabezado}) !important;
  position: fixed;
  overflow: auto;
  width: 0;
  height: 100vh;
  left: 0;
  z-index: 9;

  &.visible {
    width: 100vw;
  }
}

main {
  padding: 1em 1em 2em 1em;
  max-width: 1600px;
  margin: 0 auto;
}

#contenido {
  min-height: 86vh;
  width: 100vw;
  position: relative;

  &.oscuro {
    background-color: var(--tinta);
    color: var(--sobreOscuro);

    main {
      max-width: 1240px;
      margin: 0;
      padding: 32px clamp(18px, 3.6vw, 52px) 48px;
    }
  }
}

.botonMenu {
  height: 2.2rem;
  position: fixed;
  top: calc(#{$altoEncabezado} + 0.6em);
  left: 0.5em;
  background-color: rgba($papel, 0.9);
  padding: 0.5rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border-radius: 0.25em;
  cursor: pointer;
  z-index: 10;

  .linea {
    background-color: $profundidad;
    border-radius: 1em;
    width: 1.8rem;
    height: 0.2rem;
  }

  .linea1 {
    transform-origin: 0% 0%;
    transition: transform 100ms ease-in-out;
  }

  .linea3 {
    transform-origin: 0% 100%;
    transition: transform 100ms ease-in-out;
  }

  &.cerrar {
    left: 85vw;
    .linea {
      background-color: $tinta;
    }

    .linea1 {
      display: block;
      transform: rotate(45deg);
    }

    .linea2 {
      opacity: 0;
    }

    .linea3 {
      display: block;
      transform: rotate(-45deg);
    }
  }
}

// Pantallas medianas (Tablets)
@media (min-width: $minTablet) {
  #contenedorMenu {
    &.visible {
      width: 300px;
    }
  }

  .botonMenu {
    &.cerrar {
      left: 248px;
    }
  }
}

// En celular y tableta el menú de la sección está en el botón ☰ del encabezado (components/Encabezado.vue).
@media (max-width: #{$minPantalla - 1px}) {
  .botonMenu,
  #contenedorMenu {
    display: none;
  }
}

// Pantallas grandes - Ahora si el menú y el contenido son visibles al tiempo.
@media (min-width: $minPantallaGrande) {
  #contenedorMenu {
    width: 270px;
  }

  #contenido {
    width: calc(100vw - 270px);
  }

  .botonMenu {
    display: none;
  }

  main {
    padding: 2em 5em 2em 3em;
  }
}

// Entre 992 y 1199 px (menú lateral oculto tras su botón), el contenido deja espacio al botón.
@media (min-width: $minPantalla) and (max-width: #{$minPantallaGrande - 1px}) {
  main {
    padding-left: 5em;
  }

  #contenido.oscuro main {
    padding-top: 64px;
  }
}

//Pantallas gigantes
@media (min-width: $minPantallaGigante) {
}
</style>

<!-- Piezas compartidas por las páginas del rediseño (área oscura con paneles claros).
     :where(#contenido) quita el peso del id: estas reglas ganan a los estilos base (p, h1…) pero los estilos
     propios de cada página (con dos o más clases) las pueden ajustar. -->
<style lang="scss">
:where(#contenido).oscuro {
  .encabezadoPagina {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 28px;
  }

  .ceja {
    margin: 0;
    font-family: var(--fuenteSans);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--sobreOscuro);
  }

  .tituloPagina {
    margin: 0;
    font-family: var(--fuenteSerif);
    font-weight: 400;
    font-size: clamp(30px, 3vw, 44px);
    line-height: 1.05;
    color: var(--oro);
  }

  .entradilla {
    margin: 0 0 22px;
    max-width: 940px;
    font-family: var(--fuenteSerif);
    font-size: clamp(17px, 1.4vw, 19px);
    line-height: 1.55;
    color: #d8c9b2;

    &.grande {
      font-size: clamp(18px, 1.6vw, 21px);
      line-height: 1.5;
    }
  }

  .textoSuave {
    margin: 0;
    max-width: 940px;
    font-size: 15px;
    line-height: 1.65;
    color: #d8c9b2;
  }

  .tituloBloque {
    margin: 0;
    font-family: var(--fuenteSerif);
    font-weight: 400;
    font-size: clamp(26px, 2.4vw, 32px);
    color: var(--oro);
  }

  .nota {
    margin: 0;
    font-size: 15px;
    color: var(--sobreOscuroSuave);
  }

  .panelClaro {
    background-color: var(--papel);
    color: var(--tinta);
    border: 1px solid #e0d3b8;
    border-radius: 18px;
    box-sizing: border-box;

    p {
      margin: 0;
      font-size: 15px;
      line-height: 1.65;
      color: var(--textoCuerpo);
    }
  }

  .etiquetaPanel {
    font-family: var(--fuenteSans);
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #8a6a45;
  }

  .botonOcre,
  .botonContorno {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 48px;
    padding: 0 24px;
    border-radius: 10px;
    font-family: var(--fuenteSans);
    font-size: 15px;
    font-weight: 700;
    box-sizing: border-box;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease;

    svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }

  .botonOcre {
    background-color: var(--ocre);

    &:link,
    &:visited,
    &:hover {
      color: var(--papel);
    }

    &:hover {
      background-color: var(--ocreOscuro);
    }
  }

  .botonContorno {
    border: 1px solid #5a4a3e;
    font-weight: 600;

    &:link,
    &:visited {
      color: var(--sobreOscuro);
    }

    &:hover {
      border-color: var(--oro);
      color: var(--oro);
    }

    svg {
      stroke: var(--oro);
    }
  }

  .pildora {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    padding: 0 18px;
    border: 1px solid #5a4a3e;
    border-radius: 999px;
    font-size: 14.5px;
    font-weight: 600;
    box-sizing: border-box;

    &:link,
    &:visited {
      color: var(--sobreOscuro);
    }

    &:hover {
      border-color: var(--oro);
    }

    svg {
      width: 15px;
      height: 15px;
      fill: none;
      stroke: var(--oro);
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  }

  .chipPanel {
    display: inline-flex;
    align-items: center;
    min-height: 34px;
    padding: 0 14px;
    border-radius: 999px;
    background-color: var(--arena);
    font-size: 13px;
    font-weight: 600;
    color: #8a6a45;
  }

  .creditoImagen {
    margin-top: 12px;
    font-size: 13px;
    line-height: 1.5;
    color: var(--sobreOscuroSuave);

    a:link,
    a:visited {
      color: var(--sobreOscuroSuave);
    }

    a:hover {
      color: var(--oro);
    }

    .numero {
      color: var(--oro);
      font-weight: 700;
    }
  }

  .separadorOscuro {
    border-top: 1px solid #3a2e27;
    padding-top: 28px;
  }
}
</style>
