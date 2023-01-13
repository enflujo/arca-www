<script setup>
import { usarGeneral } from '~~/cerebros/general';
import { gql } from '~~/utilidades/ayudas';

const ruta = useRoute();
const general = usarGeneral();

const infoGeneral = ref([]);

const Info = gql`
  query {
    general {
      nombre
      proyecto
      proposito
      conjunto
    }
  }
`;

// obtenerDatosAsinc se usa para obtener datos de forma reactiva, no estática.
// Para obtener los datos estáticos (ej. "head") se usa la función con await. Ej. archivo - index.vue
const { data, pending } = obtenerDatosAsinc('info', Info);

watch(data, ({ general: datosGeneral }) => {
  infoGeneral.value = datosGeneral;
});
</script>

<template>
  <Cargador v-if="pending" />
  <div v-else id="sobre-arca">
    <h1 class="titulo logo-texto claridad">{{ infoGeneral.nombre }}</h1>
    <p class="parrafo" v-html="infoGeneral.proyecto"></p>
    <p class="parrafo" v-html="infoGeneral.proposito"></p>
    <p class="parrafo" v-html="infoGeneral.conjunto"></p>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

#sobre-arca {
  width: 80%;
  margin: 10vh auto;
}

.parrafo {
  margin-top: 1em;
}
</style>
