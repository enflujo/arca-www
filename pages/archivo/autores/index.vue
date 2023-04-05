<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { gql } from '~~/utilidades/ayudas';

const datos = ref([]);
const titulo = 'Autores';
const ruta = useRoute();
const cerebroArchivo = usarArchivo();

const Autores = gql`
  query {
    autores(limit: -1, sort: ["apellido"]) {
      id
      nombre
      apellido
      obras_func {
        count
      }
    }
  }
`;

const { data, pending } = obtenerDatosAsinc('autores', Autores);

watch(data, ({ autores }) => {
  datos.value = autores.map((autor) => {
    autor.url = `/archivo/autores/${autor.id}`;
    const partesNombre = [];

    if (autor.apellido) {
      partesNombre.push(autor.apellido);
    }

    if (autor.nombre) {
      partesNombre.push(autor.nombre);
    }
    autor.nombreCompleto = partesNombre.join(', ');

    return autor;
  });
});

definePageMeta({ layout: 'archivo' });
useHead(elementosCabeza({ titulo }, ruta.path));
</script>

<template>
  <h1>{{ titulo }}</h1>
  <Cargador v-if="pending" />

  <div v-else>
    <VistaFiltros :vistas="['abc', 'colombinas']" vistaInicial="abc" />

    <VistaAbecedario v-if="cerebroArchivo.vistaActual === 'abc'" :datos="datos" coleccion="autores" />
    <GraficaColombinas v-if="cerebroArchivo.vistaActual === 'colombinas'" :datos="datos" coleccion="autores" />
  </div>
</template>

<style lang="scss" scoped></style>
