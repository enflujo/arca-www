<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql, obtenerDatos, ordenarPorNombre } from '~~/utilidades/ayudas';

const cargando = ref(true);
const objetos = ref([]);
const cerebroArchivo = usarArchivo();

definePageMeta({ layout: 'con-buscador', keepalive: true });

onMounted(async () => {
  cerebroArchivo.paginaActual = 'objetos';

  const ObrasPorObjetos = gql`
    query {
      objetos(limit: -1) {
        nombre
        slug
        obras_func {
          count
        }
      }
    }
  `;

  const { objetos: datosObjetos } = await obtenerDatos(ObrasPorObjetos);
  ordenarPorNombre(datosObjetos);
  objetos.value = datosObjetos;

  cargando.value = false;
});
</script>

<template>
  <Cargador v-if="cargando" />

  <h1>Objetos</h1>
  <p v-for="objeto in objetos" :key="objeto.slug">{{ objeto.nombre }} ({{ objeto.obras_func.count }})</p>
</template>
