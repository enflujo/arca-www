<script setup>
import { gql } from '~~/utilidades/ayudas';
import { usarArchivo } from '~~/cerebros/archivo';

const datos = ref(null);
const paises = ref(null);
const ubicaciones = ref(null);
const valorMaximoObras = ref(0);
const contenedorUbicaciones = ref(null);

definePageMeta({ layout: 'archivo' });

const ObrasPorPaises = gql`
  query {
    paises(filter: { obras_func: { count: { _neq: 0 } } }, limit: -1) {
      id
      nombre
      slug
      geo
      obras(limit: -1) {
        id
      }
      obras_func {
        count
      }
    }

    ubicaciones(limit: -1) {
      id
      nombre
      geo
      obras_func {
        count
      }
    }
  }
`;

const { data, pending } = obtenerDatosAsinc('obrasPorPais', ObrasPorPaises);
const cerebroArchivo = usarArchivo();

watch(data, ({ paises: datosPaises, ubicaciones: datosUbicaciones }) => {
  /**
   * Creamos Geojson agregando todas las ubicaciones y países que se van a pintar en el mapa (es más rápido que agregar muchos "source" y "layer" para cada lugar por separado)
   */
  const ubicacionesGeojson = {
    type: 'FeatureCollection',
    features: datosUbicaciones.map(({ id, nombre, obras_func, geo }) => {
      return { type: 'Feature', properties: { id, nombre, obras: obras_func.count }, geometry: geo, id };
    }),
  };
  // Geojson para países.
  const paisesGeojson = {
    type: 'FeatureCollection',
    features: datosPaises.map(({ id, nombre, slug, obras_func, geo }) => {
      return { type: 'Feature', properties: { id, nombre, slug, obras: obras_func.count }, geometry: geo, id };
    }),
  };

  /**
   * Ordenar por cantidad de obras en el país.
   */
  datos.value = datosPaises;

  const maximoObras = datos.value[0].obras_func.count;
  paises.value = paisesGeojson;
  ubicaciones.value = ubicacionesGeojson;
  valorMaximoObras.value = maximoObras;
});
</script>

<template>
  <ClientOnly>
    <h1>Ubicaciones</h1>

    <Cargador v-if="pending" />

    <div v-else id="contenedorUbicaciones" ref="contenedorUbicaciones">
      <VistaFiltros vistaInicial="mapa" :vistas="['mapa', 'abc', 'colombinas']" />

      <Mapa
        v-if="paises && ubicaciones && cerebroArchivo.vistaActual === 'mapa'"
        :paises="paises"
        :ubicaciones="ubicaciones"
        :max="valorMaximoObras"
      />

      <VistaAbecedario v-if="cerebroArchivo.vistaActual === 'abc'" :datos="datos" coleccion="paises" />

      <GraficaColombinas v-if="cerebroArchivo.vistaActual === 'colombinas'" :datos="datos" coleccion="paises" />
    </div>
  </ClientOnly>
</template>
