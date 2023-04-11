<script setup>
import { usarArchivo } from '~~/cerebros/archivo';
import { indiceColeccion } from '~~/utilidades/queries';

const props = defineProps({ coleccion: String, ruta: String });
const cerebroArchivo = usarArchivo();
const datos = ref([]);
const vistas = ref(['abc', 'colombinas']);
const vistaInicial = ref('abc');
const datosUbicaciones = ref(null);
const { data, pending } = obtenerDatosAsinc(`indice-${props.coleccion}`, indiceColeccion(props.coleccion));

watch(data, (respuesta) => {
  if (props.ruta && props.ruta === 'ubicaciones') {
    procesarUbicaciones(respuesta);
  } else if (props.coleccion === 'autores') {
    procesarAutores(respuesta);
  } else {
    datos.value = respuesta[props.coleccion];
  }
});

onMounted(() => {
  if (props.ruta && props.ruta === 'ubicaciones') {
    vistas.value = ['mapa', 'abc', 'colombinas'];
    vistaInicial.value = 'mapa';
  } else {
    vistas.value = ['abc', 'colombinas'];
  }
});

function procesarUbicaciones({ paises, ubicaciones }) {
  /**
   * Creamos Geojson agregando todas las ubicaciones y países que se van a pintar en el mapa (es más rápido que agregar muchos "source" y "layer" para cada lugar por separado)
   */
  const ubicacionesGeojson = {
    type: 'FeatureCollection',
    features: ubicaciones.map(({ id, nombre, obras_func, geo }) => {
      return { type: 'Feature', properties: { id, nombre, obras: obras_func.count }, geometry: geo, id };
    }),
  };
  // Geojson para países.
  const paisesGeojson = {
    type: 'FeatureCollection',
    features: paises.map(({ id, nombre, slug, obras_func, geo }) => {
      return { type: 'Feature', properties: { id, nombre, slug, obras: obras_func.count }, geometry: geo, id };
    }),
  };

  /**
   * Ordenar por cantidad de obras en el país.
   */
  const max = paises[0].obras_func.count;

  datosUbicaciones.value = { paises: paisesGeojson, ubicaciones: ubicacionesGeojson, max };
  datos.value = paises;
}

function procesarAutores({ autores }) {
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
}
</script>

<template>
  <Cargador v-if="pending" />

  <div v-else>
    <VistaFiltros :vistas="vistas" :vistaInicial="vistaInicial" />
    <VistaAbecedario v-if="cerebroArchivo.vistaActual === 'abc'" :datos="datos" :coleccion="ruta || coleccion" />
    <GraficaColombinas
      v-if="cerebroArchivo.vistaActual === 'colombinas'"
      :datos="datos"
      :coleccion="ruta || coleccion"
    />
    <VistaMapa
      v-if="cerebroArchivo.vistaActual === 'mapa' && datosUbicaciones"
      :paises="datosUbicaciones.paises"
      :ubicaciones="datosUbicaciones.ubicaciones"
      :max="datosUbicaciones.max"
    />
  </div>
</template>
