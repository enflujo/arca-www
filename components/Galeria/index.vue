<script setup>
import { usarArchivo } from '~/cerebros/archivo';
import { definirDimsImagen } from '~/utilidades/ayudas';
import { datosGeneralesColeccion, datosObrasGaleria } from '~~/utilidades/queries';

const props = defineProps({
  nombreCampo: String,
  coleccion: String,
  enTablaRelacional: {
    type: Boolean,
    default: false,
  },
  singular: String,
});

const titulo = ref('');

const crearNombre = (datosAutor) => {
  const partesNombre = [];
  if (datosAutor.nombre) partesNombre.push(datosAutor.nombre);
  if (datosAutor.apellido) partesNombre.push(datosAutor.apellido);

  return partesNombre.join(' ');
};

/**
 * Operaciones en el servidor
 */
const cerebroArchivo = usarArchivo();
const ruta = useRoute();
const datos = ref(null);
const paginaActual = ref(ruta.query.pagina || 1);

const respuesta = await obtenerDatos(
  props.coleccion,
  datosGeneralesColeccion(props.coleccion, ruta.params.slug || ruta.params.id, !!ruta.params.id)
);

const datosMeta =
  props.coleccion === 'autores'
    ? {
        nombre: crearNombre(respuesta.autores[0]),
        descripcion: respuesta.autores[0].biografia,
      }
    : respuesta[props.coleccion][0];

useHead(elementosCabeza(datosMeta, ruta.path)); // SEO

titulo.value = respuesta[props.coleccion][0].nombre;

if (props.coleccion === 'personajes') {
  datos.value = limpiarFechas(respuesta.personajes[0]);
} else if (props.coleccion === 'autores') {
  datos.value = limpiarFechas(respuesta.autores[0]);
  titulo.value = crearNombre(respuesta.autores[0]);
} else {
  datos.value = respuesta[props.coleccion][0];
}

function limpiarFechas(datosGenerales) {
  let desde;
  let desdeAnotacion;
  let hasta;
  let hastaAnotacion;

  if (props.coleccion === 'personajes') {
    desde = datosGenerales.beatificacion_canonizacion_desde;
    desdeAnotacion = datosGenerales.beatificacion_canonizacion_desde_anotacion;
    hasta = datosGenerales.beatificacion_canonizacion_hasta;
    hastaAnotacion = datosGenerales.beatificacion_canonizacion_hasta_anotacion;
  } else {
    desde = datosGenerales.desde;
    desdeAnotacion = datosGenerales.desde_anotacion;
    hasta = datosGenerales.hasta;
    hastaAnotacion = datosGenerales.hasta_anotacion;
  }

  datosGenerales.fechas = [];

  if (desde || desdeAnotacion) {
    if (desde && desdeAnotacion) {
      desde += ` (${desdeAnotacion})`;
    } else if (desdeAnotacion) {
      desde = desdeAnotacion;
    }

    datosGenerales.fechas.push(desde);
  }

  if (hasta || hastaAnotacion) {
    if (datosGenerales.fechas.length === 0) {
      datosGenerales.fechas.push('?');
    }

    if (hasta && hastaAnotacion) {
      hasta += ` (${hastaAnotacion})`;
    } else if (hastaAnotacion) {
      hasta = hastaAnotacion;
    }

    datosGenerales.fechas.push(hasta);
  }

  return datosGenerales;
}

/**
 * Operaciones en el cliente
 */
const obras = ref([]);
const cargando = ref(false);

const { data, pending } = obtenerDatosAsinc(
  `obras-${datos.value.id}`,
  datosObrasGaleria(
    props.coleccion,
    props.nombreCampo,
    ruta.params.slug || ruta.params.id,
    props.enTablaRelacional,
    paginaActual.value,
    !!ruta.params.id
  )
);

watch(data, (datosObras) => {
  obras.value = limpiarDatos(datosObras);
});

const numeroPaginas = computed(() => {
  if (datos.value && datos.value.obras_func) {
    return Math.ceil(datos.value.obras_func.count / cerebroArchivo.obrasPorPagina);
  } else {
    return 1;
  }
});

function limpiarDatos(nuevosDatos) {
  let respuesta;
  const datosObras = props.enTablaRelacional ? nuevosDatos[`obras_${props.coleccion}`] : nuevosDatos.obras;

  // Extraer las obras de colección directamente o de la tabla relacional.
  respuesta = !props.enTablaRelacional
    ? datosObras.map(definirDimsImagen)
    : datosObras.map((obra) => definirDimsImagen(obra.obras_id));

  return respuesta;
}

function cargarPagina(pagina) {
  if (pagina <= numeroPaginas.value) {
    cargando.value = true;

    obtenerDatos(
      `obras-${datos.value.id}${pagina}`,
      datosObrasGaleria(
        props.coleccion,
        props.nombreCampo,
        ruta.params.slug || ruta.params.id,
        props.enTablaRelacional,
        pagina,
        !!ruta.params.id
      )
    ).then((respuesta) => {
      obras.value = [...obras.value, ...limpiarDatos(respuesta)];
      paginaActual.value = pagina;
      cargando.value = false;
    });
  } else {
    cargando.value = false;
  }
}
</script>

<template>
  <h1>{{ `${singular} - ${titulo}` }}</h1>
  <GraficaContador :numeroObras="datos.obras_func.count" />
  <GaleriaInformacion :coleccion="coleccion" :datos="datos" />

  <Cargador v-if="pending" />
  <GaleriaMosaico v-else :obras="obras" :pagina="paginaActual" :cargarPagina="cargarPagina" :cargando="cargando" />
</template>
