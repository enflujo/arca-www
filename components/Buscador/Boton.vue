<script setup lang="ts">
import { usarGeneral } from '~/cerebros/general';

const cerebroGeneral = usarGeneral();
const ruta = useRoute();

function abrirBuscador() {
  cerebroGeneral.buscadorVisible = true;
}

// «?buscar=texto» abre el buscador con ese texto; «?buscar=» (vacío, p. ej. desde la barra de
// «Visualización y análisis») lo abre listo para escribir.
onMounted(async () => {
  if (ruta.query.buscar !== undefined) {
    cerebroGeneral.busquedaActual = (ruta.query.buscar as string) || '';
    abrirBuscador();
  }
});
</script>

<template>
  <button id="botonBuscar" type="button" aria-label="Buscar obras, autores, temas…" @click="abrirBuscador">
    <span class="indicacion">Buscar obras, autores…</span>
    <svg class="lupa" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  </button>
</template>

<style lang="scss" scoped>
#botonBuscar {
  margin-left: auto;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.8em;
  height: 40px;
  width: 40px;
  padding: 0 12px;
  box-sizing: border-box;
  border-radius: 999px;
  border: 1px solid rgba(243, 233, 216, 0.28);
  background-color: rgba(28, 21, 18, 0.55);
  color: var(--sobreOscuroSuave);
  font-family: var(--fuenteSans);
  font-size: 13.5px;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    border-color: var(--oro);
    color: var(--sobreOscuro);
  }
}

.indicacion {
  display: none;
  white-space: nowrap;
}

.lupa {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

@media (min-width: $minPantallaGrande) {
  #botonBuscar {
    width: 200px;
    padding: 0 16px 0 18px;
  }

  .indicacion {
    display: block;
  }
}

@media (min-width: 1440px) {
  #botonBuscar {
    width: 230px;
  }
}
</style>
