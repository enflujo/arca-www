<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { indiceColeccion } from '~~/utilidades/queries';

const props = defineProps({ coleccion: String, ruta: String });
const cerebroArchivo = usarArchivo();
const datos = ref([]);

const { data, pending } = obtenerDatosAsinc(`indice-${props.coleccion}`, indiceColeccion(props.coleccion));

watch(data, (respuesta) => {
  datos.value = respuesta[props.coleccion];
});
</script>

<template>
  <Cargador v-if="pending" />

  <div v-else>
    <VistaFiltros :vistas="['abc', 'colombinas']" vistaInicial="abc" />
    <VistaAbecedario v-if="cerebroArchivo.vistaActual === 'abc'" :datos="datos" :coleccion="ruta || coleccion" />

    <GraficaColombinas
      v-if="cerebroArchivo.vistaActual === 'colombinas'"
      :datos="datos"
      :coleccion="ruta || coleccion"
    />
  </div>
</template>
