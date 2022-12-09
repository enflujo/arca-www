<script setup>
import { usarGeneral } from '@/store/general';

const cerebro = usarGeneral();

if (!cerebro.datosCargados) {
  await useAsyncData('general', cerebro.cargarGeneral);
}
</script>

<template>
  <div id="contenedor">
    <MenuGeneral />
    <main role="main">
      <MenuBuscador />
      <div class="pagina">
        <slot />
      </div>
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
  display: flex;
  flex-direction: row;
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
