<script setup lang="ts">
import { usarGeneral } from '~~/cerebros/general';

const cerebro = usarGeneral();

if (!cerebro.datosCargados) {
  console.log(cerebro.datosCargados);
  // await useAsyncData('general', cerebro.cargarGeneral);
  await cerebro.cargarGeneral();
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
  display: flex;
  flex-direction: column;
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
}
// Pantallas grandes
@media (min-width: $minPantallaGrande) {
}
</style>
