<script setup>
import { usarGeneral } from '~/cerebros/general';

const cerebro = usarGeneral();

if (!cerebro.datosCargados) {
  await cerebro.cargarGeneral();
}
</script>

<template>
  <div>
    <NuxtLayout>
      <Encabezado />
      <NuxtLoadingIndicator />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
