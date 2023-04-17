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
  datos.value = procesarDatos(respuesta);
});

onMounted(() => {
  if (props.ruta === 'ubicaciones') {
    vistas.value = ['mapa', 'abc', 'colombinas'];
    vistaInicial.value = 'mapa';
  }
});

function procesarUbicaciones({ paises, ubicaciones }) {
  /**
   * Creamos Geojson agregando todas las ubicaciones y países que se van a pintar en el mapa (es más rápido que agregar muchos "source" y "layer" para cada lugar por separado)
   */
  const ubicacionesGeojson = {
    type: 'FeatureCollection',
    features: ubicaciones.map((ubicacion) => {
      const { id, nombre, obras_func, geo } = ubicacion;

      return { type: 'Feature', properties: { id, nombre, obras: obras_func.count }, geometry: geo, id };
    }),
  };
  // Geojson para países.
  const paisesGeojson = {
    type: 'FeatureCollection',
    features: paises.map((pais) => {
      const { id, nombre, slug, obras_func, geo } = pais;

      pais.url = `/archivo/paises/${slug}`;
      pais.texto = `${nombre} (${obras_func.count})`;
      return { type: 'Feature', properties: { id, nombre, slug, obras: obras_func.count }, geometry: geo, id };
    }),
  };

  /**
   * Ordenar por cantidad de obras en el país.
   */
  const max = paises[0].obras_func.count;

  datosUbicaciones.value = { paises: paisesGeojson, ubicaciones: ubicacionesGeojson, max };

  return paises;
}

function procesarAutores({ autores }) {
  return autores.map((autor) => {
    autor.url = `/archivo/autores/${autor.id}`;
    const partesNombre = [];

    if (autor.apellido) {
      partesNombre.push(autor.apellido);
    }

    if (autor.nombre) {
      partesNombre.push(autor.nombre);
    }
    const nombreCompleto = partesNombre.join(', ');
    autor.texto = `${nombreCompleto} (${autor.obras_func.count})`;
    autor.nombreCompleto = nombreCompleto;

    return autor;
  });
}

function procesarDatos(nuevosDatos) {
  if (props.ruta === 'ubicaciones') {
    return procesarUbicaciones(nuevosDatos);
  } else if (props.coleccion === 'autores') {
    return procesarAutores(nuevosDatos);
  }

  return nuevosDatos[props.coleccion].map((instancia) => {
    if (props.coleccion === 'paises') {
      instancia.url = `/archivo/${props.coleccion}/${instancia.slug}`;
    } else {
      instancia.url = `/archivo/${props.ruta || props.coleccion}/${instancia.slug}`;
    }

    instancia.texto = `${instancia.nombre} (${instancia.obras_func.count})`;

    return instancia;
  });
}
</script>

<template>
  <Cargador v-if="pending" />

  <div v-else>
    <VistaFiltros :vistas="vistas" :vistaInicial="vistaInicial" />
    <VistaAbecedario v-if="cerebroArchivo.vistaActual === 'abc'" :datos="datos" :coleccion="coleccion" />
    <VistaColombinas v-if="cerebroArchivo.vistaActual === 'colombinas'" :datos="datos" :coleccion="coleccion" />
    <VistaMapa
      v-if="cerebroArchivo.vistaActual === 'mapa' && datosUbicaciones"
      :paises="datosUbicaciones.paises"
      :ubicaciones="datosUbicaciones.ubicaciones"
      :max="datosUbicaciones.max"
    />
  </div>
</template>
