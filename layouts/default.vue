<script setup>
import { usarGeneral } from '@/store/general';

const cerebro = usarGeneral();
const colorIcono = ref('#FFF');
const menuAbierto = ref(false);

if (!cerebro.datosCargados) {
  await useAsyncData('general', cerebro.cargarGeneral);
}

/**
 * Intercambia el estado del menú: si esta abierto lo cierra, si esta cerrado lo abre.
 */
function resolverMenu() {
  this.menuAbierto = !this.menuAbierto;
}
/**
 * Cierra el menú, lo usamos en navegación si el menú esta abierto.
 */
function cerrarMenu() {
  if (this.menuAbierto) {
    this.menuAbierto = false;
  }
}
</script>

<template>
  <div id="contenedor">
    <!-- <Menu :menuAbierto="menuAbierto" @resolverMenu="resolverMenu" @cerrarMenu="cerrarMenu" /> -->

    <main role="main">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<style lang="scss">
@use 'sass:color';

main {
  display: flex;
  flex-direction: column;
}
#contenedor {
  display: flex;
  flex-direction: column;
  color: $profundidad;
}
.contenedor {
  display: flex;
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
