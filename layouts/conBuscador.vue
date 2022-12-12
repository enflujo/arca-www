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
    <Footer :completo="false" />
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

#contenedor {
  color: $profundidad;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}

main {
  width: 85vw;
  margin-left: 15vw;
}

.pagina {
  width: calc(100vw - 23vw);
  margin-top: 10px;
  margin-left: 8vw;
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
