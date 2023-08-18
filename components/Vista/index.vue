<script setup lang="ts">
import { usarArchivo } from '~~/cerebros/archivo';
import { indiceColeccion } from '~~/utilidades/queries';

const props = defineProps({ coleccion: String, slug: String });
const cerebroArchivo = usarArchivo();
const datos = ref([]);
const vistas = ref(['abc', 'colombinas']);
const vistaInicial = ref('abc');
const datosMapa = ref(null);
const datosLugares = reactive({ ubicaciones: [], ciudades: [], paises: [] });
const { data, pending } = obtenerDatosAsinc(`indice-${props.coleccion}`, indiceColeccion(props.coleccion));
const coleccionActual = ref(props.coleccion);
const cargando = ref(false);

watch(data, (respuesta) => {
  datos.value = procesarDatos(respuesta);
});

onMounted(() => {
  if (props.coleccion === 'ubicaciones') {
    vistas.value = ['mapa', 'abc', 'colombinas'];
    vistaInicial.value = 'mapa';
    cerebroArchivo.vistaActual = 'mapa';
    coleccionActual.value = 'paises';
  }
});

function procesarUbicaciones({ paises, ubicaciones }) {
  /**
   * Creamos Geojson agregando todas las ubicaciones y países que se van a pintar en el mapa (es más rápido que agregar muchos "source" y "layer" para cada lugar por separado)
   */
  datosLugares.ubicaciones = agregarEnlacesYTexto(ubicaciones, 'ubicaciones');
  datosLugares.paises = agregarEnlacesYTexto(paises, 'paises');

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

      pais.url = `/paises/${slug}`;
      pais.texto = `${nombre} (${obras_func.count})`;
      return { type: 'Feature', properties: { id, nombre, slug, obras: obras_func.count }, geometry: geo, id };
    }),
  };

  /**
   * Ordenar por cantidad de obras en el país.
   */
  const max = paises[0].obras_func.count;

  datosMapa.value = { paises: paisesGeojson, ubicaciones: ubicacionesGeojson, max };

  return paises;
}

function procesarAutores({ autores }) {
  return autores.map((autor) => {
    autor.url = `/autores/${autor.id}`;
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

function agregarEnlacesYTexto(datos, coleccion = coleccionActual.value) {
  return datos.map((instancia) => {
    if (coleccion === 'paises') {
      instancia.url = `/paises/${instancia.slug}`;
    } else if (coleccion === 'ciudades') {
      instancia.url = `/ciudades/${instancia.id}`;
    } else if (coleccion === 'ubicaciones') {
      instancia.url = `/ubicaciones/${instancia.id}`;
    } else {
      instancia.url = `/${props.slug}/${instancia.slug}`;
    }

    if (coleccion === 'gestos') {
      const conteo1 = instancia.obras_gesto_1_func.count;
      const conteo2 = instancia.obras_gesto_2_func.count;
      const conteo3 = instancia.obras_gesto_3_func.count;
      instancia.texto = `${instancia.nombre} (${conteo1}, ${conteo2}, ${conteo3})`;
    } else {
      instancia.texto = `${instancia.nombre} (${instancia.obras_func.count})`;
    }

    return instancia;
  });
}

function procesarDatos(nuevosDatos) {
  if (props.coleccion === 'ubicaciones') {
    return procesarUbicaciones(nuevosDatos);
  } else if (props.coleccion === 'autores') {
    return procesarAutores(nuevosDatos);
  }

  return agregarEnlacesYTexto(nuevosDatos[props.coleccion]);
}

async function cambiarDatosUbicacion(coleccion) {
  if (coleccionActual.value === coleccion) return;

  coleccionActual.value = coleccion;

  if (datosLugares[coleccion].length) {
    datos.value = datosLugares[coleccion];
  } else {
    cargando.value = true;

    const respuesta = await obtenerDatos(`indice-${coleccion}`, indiceColeccion(coleccion));
    const datosLimpios = agregarEnlacesYTexto(respuesta[coleccion]);
    datosLugares[coleccion] = datosLimpios;
    datos.value = datosLimpios;

    cargando.value = false;
  }
}
</script>

<template>
  <div id="filtros">
    <VistaFiltrosVistas :vistas="vistas" :vistaInicial="vistaInicial" />
    <VistaFiltrosUbicaciones
      v-if="coleccion === 'ubicaciones' && cerebroArchivo.vistaActual !== 'mapa'"
      :cambiarDatos="cambiarDatosUbicacion"
      :coleccion="coleccionActual"
    />
  </div>

  <Cargador v-if="pending || cargando" />

  <div v-else>
    <VistaAbecedario v-if="cerebroArchivo.vistaActual === 'abc'" :datos="datos" :coleccion="coleccionActual" />
    <VistaColombinas v-if="cerebroArchivo.vistaActual === 'colombinas'" :datos="datos" :coleccion="coleccionActual" />
    <VistaMapa
      v-if="cerebroArchivo.vistaActual === 'mapa' && datosMapa"
      :paises="datosMapa.paises"
      :ubicaciones="datosMapa.ubicaciones"
      :max="datosMapa.max"
    />
  </div>
</template>

<style lang="scss">
#filtros {
  display: flex;
  margin-bottom: 1em;
}
</style>
