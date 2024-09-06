<script setup lang="ts">
import type { FeatureCollection } from 'geojson';
import { usarArchivo } from '~/cerebros/archivo';
import type {
  Ciudad,
  DatosIndices,
  DatosUbicaciones,
  DatosVistas,
  Gesto,
  IndiceGeneral,
  Indices,
  NombresColecciones,
  Pais,
  TiposLugares,
  Ubicacion,
  Vistas,
} from '~/tipos';
import { peticion } from '~/utilidades/ayudas';
import { indiceColeccion } from '~/utilidades/queries';

interface Props {
  coleccion: NombresColecciones;
  slug: string;
}

const props = defineProps<Props>();
const cerebroArchivo = usarArchivo();
const datos: Ref = ref();
const vistas: Ref = ref(['abc', 'colombinas']);
const vistaInicial: Ref = ref('abc');
const datosMapa: Ref = ref(null);
const datosLugares: { ubicaciones: Ubicacion[]; ciudades: Ciudad[]; paises: Pais[] } = reactive({
  ubicaciones: [],
  ciudades: [],
  paises: [],
});
const { data, status } = obtenerDatosAsinc(`indice-${props.coleccion}`, indiceColeccion(props.coleccion));
const coleccionActual: Ref = ref(props.coleccion);
const cargando: Ref = ref(false);

watch(data, (respuesta: DatosIndices) => {
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

function procesarUbicaciones({ paises, ubicaciones }: DatosIndices) {
  if (!ubicaciones || !paises) return;
  /**
   * Creamos Geojson agregando todas las ubicaciones y países que se van a pintar en el mapa (es más rápido que agregar muchos "source" y "layer" para cada lugar por separado)
   */
  datosLugares.ubicaciones = agregarEnlacesYTexto(ubicaciones, 'ubicaciones') as Ubicacion[];
  datosLugares.paises = agregarEnlacesYTexto(paises, 'paises') as Pais[];

  const ubicacionesGeojson: FeatureCollection = {
    type: 'FeatureCollection',
    features: ubicaciones.map((ubicacion): DatosUbicaciones => {
      const { id, nombre, obras_func, geo } = ubicacion;

      return { type: 'Feature', properties: { id, nombre, obras: obras_func.count }, geometry: geo, id };
    }),
  };
  // Geojson para países.
  const paisesGeojson: FeatureCollection = {
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

function procesarAutores({ autores }: DatosIndices) {
  if (!autores) return;

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

function agregarEnlacesYTexto(datos: Indices, coleccion = coleccionActual.value) {
  return datos.map((instancia) => {
    if (coleccion === 'paises') {
      (instancia as Pais).url = `/paises/${(instancia as Pais).slug}`;
    } else if (coleccion === 'ciudades') {
      (instancia as Ciudad).url = `/ciudades/${(instancia as Ciudad).id}`;
    } else if (coleccion === 'ubicaciones') {
      (instancia as Ubicacion).url = `/ubicaciones/${(instancia as Ubicacion).id}`;
    } else {
      (instancia as Pais).url = `/${props.slug}/${(instancia as Pais).slug}`;
    }

    if (coleccion === 'gestos') {
      const conteo1 = (instancia as Gesto).obras_gesto_1_func.count;
      const conteo2 = (instancia as Gesto).obras_gesto_2_func.count;
      const conteo3 = (instancia as Gesto).obras_gesto_3_func.count;
      (instancia as Gesto).texto = `${instancia.nombre} (${conteo1}, ${conteo2}, ${conteo3})`;
    } else {
      (instancia as IndiceGeneral).texto = `${instancia.nombre} (${(instancia as IndiceGeneral).obras_func.count})`;
    }

    return instancia;
  });
}

function procesarDatos(nuevosDatos: DatosIndices) {
  if (props.coleccion === 'ubicaciones') {
    return procesarUbicaciones(nuevosDatos);
  } else if (props.coleccion === 'autores') {
    return procesarAutores(nuevosDatos);
  }

  return agregarEnlacesYTexto(nuevosDatos[props.coleccion] as Indices);
}

async function cambiarDatosUbicacion(tipoLugar: TiposLugares) {
  if (coleccionActual.value === tipoLugar) return;

  coleccionActual.value = tipoLugar;

  if (datosLugares[tipoLugar].length) {
    datos.value = datosLugares[tipoLugar];
  } else {
    cargando.value = true;

    const respuesta = await peticion(indiceColeccion(tipoLugar));
    const datosLimpios = agregarEnlacesYTexto(respuesta[tipoLugar]);

    if (tipoLugar === 'ubicaciones') {
      datosLugares.ubicaciones = datosLimpios as Ubicacion[];
    } else if (tipoLugar === 'ciudades') {
      datosLugares.ciudades = datosLimpios as Ciudad[];
    } else if (tipoLugar === 'paises') {
      datosLugares.paises = datosLimpios as Pais[];
    }

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

  <Cargador v-if="status === 'pending' || cargando" />

  <div v-else>
    <VistaAbecedario
      v-if="cerebroArchivo.vistaActual === 'abc'"
      :datos="datos as DatosVistas[]"
      :coleccion="coleccionActual"
    />
    <VistaColombinas
      v-if="cerebroArchivo.vistaActual === 'colombinas'"
      :datos="datos as DatosVistas[]"
      :coleccion="coleccionActual"
    />
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
