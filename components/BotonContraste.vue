<script setup lang="ts">
// Activa o desactiva el modo de alto contraste (assets/css/contraste.css). La preferencia se guarda en
// localStorage ('arca.contraste') y también la lee la página de «Visualización y análisis».
const activo = ref(false);

onMounted(() => {
  activo.value = document.documentElement.classList.contains('altoContraste');
});

function alternar() {
  activo.value = !activo.value;
  document.documentElement.classList.toggle('altoContraste', activo.value);
  try {
    localStorage.setItem('arca.contraste', activo.value ? 'alto' : 'normal');
  } catch {}
}
</script>

<template>
  <button
    type="button"
    class="botonContraste"
    :class="{ activo }"
    :aria-pressed="activo"
    :title="activo ? 'Volver al contraste normal' : 'Activar alto contraste'"
    @click="alternar"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18z" />
    </svg>
    <span class="texto">Contraste</span>
  </button>
</template>

<style lang="scss" scoped>
.botonContraste {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid rgba(243, 233, 216, 0.28);
  border-radius: 999px;
  background: transparent;
  color: var(--sobreOscuro);
  font-family: var(--fuenteSans);
  font-size: 0.85em;
  cursor: pointer;

  &:hover {
    border-color: var(--oro);
  }

  &.activo {
    border-color: var(--oro);
    background-color: var(--oro);
    color: var(--tinta);
  }

  svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;

    path {
      fill: currentColor;
      stroke: none;
    }
  }
}

// En pantallas pequeñas, solo el ícono.
@media (max-width: #{$minPantallaGrande - 1px}) {
  .botonContraste {
    width: 40px;
    padding: 0;
    justify-content: center;
  }

  .texto {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }
}
</style>
