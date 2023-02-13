<script setup>
import { usarGeneral } from '~~/cerebros/general';

const cerebro = usarGeneral();

if (!cerebro.datosCargados) {
  await useAsyncData('general', cerebro.cargarGeneral);
}
</script>

<template>
  <div id="contenedor">
    <MenuGeneral />
    <MenuBuscador />
    <main role="main">
      <slot />
    </main>
    <Guardaescobas :completo="false" />
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

#contenedor {
  color: var(--profundidad);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 86vh;
}

main {
  margin-left: 19vw;
  padding: 2em 5em 2em 3em;
  background-color: var(--amarilloPetalo);
}

// Teléfonos horizontal
@media (min-width: var(--minCelular)) {
}
// Pantallas medianas (Tablets)
// @media (min-width: var(--minTablet)) {
// }
// Dispositivos grandes y pantallas medianas
@media (min-width: var(--minPantalla)) {
}
// Pantallas grandes
@media (min-width: var(--minPantallaGrande)) {
}
</style>
