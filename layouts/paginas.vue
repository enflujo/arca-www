<script setup>
import { usarGeneral } from '~~/cerebros/general';

const cerebro = usarGeneral();

if (!cerebro.datosCargados) {
  await useAsyncData('general', cerebro.cargarGeneral);
}
</script>

<template>
  <Encabezado />
  <div id="contenedor">
    <div id="contenido">
      <Buscador v-if="cerebro.buscadorVisible" />
      <main>
        <slot />
      </main>
      <Guardaescobas :completo="false" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
main {
  width: 90vw;
  margin: 0 auto;
  display: block;
  padding: 2em 0 0 4em;
}

#contenedor {
  display: flex;
  flex-direction: column;
  color: var(--profundidad);
  margin-top: $altoEncabezado;
  position: relative;
}

// Teléfonos horizontal
@media (min-width: $minCelular) {
}
// Pantallas medianas (Tablets)
// @media (min-width: $minTablet) {
// }
// Dispositivos grandes y pantallas medianas
@media (min-width: $minPantalla) {
  main {
    width: 70vw;
    max-width: 1400px;
  }
}
// Pantallas grandes
@media (min-width: $minPantallaGrande) {
}
</style>
