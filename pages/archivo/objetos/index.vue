<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const objetos = ref([]);
const cerebroArchivo = usarArchivo();
cerebroArchivo.paginaActual = 'Objetos';

const ObrasPorObjetos = gql`
  query {
    objetos(sort: ["nombre"], limit: -1) {
      nombre
      slug
      obras_func {
        count
      }
    }
  }
`;

const { objetos: datosObjetos } = await obtenerDatos('obrasPorObjetos', ObrasPorObjetos);
objetos.value = datosObjetos;

definePageMeta({ layout: 'con-buscador', keepalive: true });
</script>

<template>
  <h1>Objetos</h1>
  <!--<ul class="opciones">
    <li v-for="objeto in objetos" :key="objeto.slug">
      <NuxtLink :to="`/archivo/objetos/${objeto.slug}`">{{ objeto.nombre }} ({{ objeto.obras_func.count }})</NuxtLink>
    </li>
  </ul>
-->
  <GraficaColombinas :datos="objetos" coleccion="objetos" />
</template>
