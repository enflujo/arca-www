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
        <h1>ERROR 404</h1>
        <h2>La página que esta buscando no existe</h2>
      </main>
      <Guardaescobas :completo="false" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
main {
  display: flex;
  flex-direction: column;
  background-color: $profundidad;
  color: $claridad;
  justify-content: center;
  align-items: center;
}
</style>
