<script setup lang="ts">
import type {
  Autor,
  AutorProcesado,
  Colecciones,
  EntradaColeccion,
  Gesto,
  Obra,
  ObraEnRelacional,
  ObraGaleria,
  PaginaArchivo,
  Personaje,
  PersonajeProcesado,
} from '~/tipos';
import { usarArchivo } from '~/cerebros/archivo';
import { definirDimsImagen } from '~/utilidades/ayudas';
import { datosGeneralesColeccion, datosObrasGaleria } from '~/utilidades/queries';

interface Props {
  coleccion: keyof Colecciones;
  slug: string;
  nombreCampo?: string;
  enTablaRelacional?: boolean;
  singular: string;
}

const props = withDefaults(defineProps<Props>(), {
  enTablaRelacional: false,
});

const titulo: Ref<string> = ref('');

const crearNombre = (datosAutor: Autor) => {
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
const datos: Ref<AutorProcesado | PersonajeProcesado | PaginaArchivo | EntradaColeccion | undefined> = ref();
const paginaActual: Ref<number> = ref(+(ruta.query.pagina as string) || 1);
const esId = /^\d+$/.test(props.slug);

const respuesta: Colecciones = await obtenerDatos(
  `generalesColeccion${props.coleccion}`,
  datosGeneralesColeccion(props.coleccion, props.slug, esId)
);

const { coleccion } = props;

const respuestaDatos = respuesta[coleccion];

if (respuestaDatos) {
  const datosMeta =
    coleccion === 'autores' && respuesta.autores
      ? {
          nombre: crearNombre(respuesta.autores[0]),
          descripcion: respuesta.autores[0].biografia,
        }
      : respuestaDatos[0];

  useHead(elementosCabeza(datosMeta, ruta.path)); // SEO
  titulo.value = respuestaDatos[0].nombre;
  if (props.coleccion === 'personajes' && respuesta.personajes) {
    datos.value = limpiarFechas(respuesta.personajes[0] as Personaje);
  } else if (props.coleccion === 'autores' && respuesta.autores) {
    datos.value = limpiarFechas(respuesta.autores[0]);
    titulo.value = crearNombre(respuesta.autores[0]);
  } else if (coleccion === 'gestos') {
    const datosGestos = respuestaDatos[0] as Gesto;
    const conteoObras =
      datosGestos.obras_gesto_1_func.count +
      datosGestos.obras_gesto_2_func.count +
      datosGestos.obras_gesto_3_func.count;

    datos.value = Object.assign(datosGestos, { obras_func: { count: conteoObras } });
  } else {
    datos.value = respuestaDatos[0] as EntradaColeccion;
  }
}

function limpiarFechas(datosGenerales: Autor | Personaje): AutorProcesado | PersonajeProcesado {
  let desde: string | null;
  let desdeAnotacion: string | undefined;
  let hasta: string | null;
  let hastaAnotacion: string | undefined;
  const respuesta: { fechas: [desde?: string, hasta?: string] } = { fechas: [] };

  if (props.coleccion === 'personajes') {
    const personaje = datosGenerales as Personaje;
    desde = personaje.beatificacion_canonizacion_desde ? `${personaje.beatificacion_canonizacion_desde}` : null;
    desdeAnotacion = personaje.beatificacion_canonizacion_desde_anotacion;
    hasta = personaje.beatificacion_canonizacion_hasta ? `${personaje.beatificacion_canonizacion_hasta}` : null;
    hastaAnotacion = personaje.beatificacion_canonizacion_hasta_anotacion;
  } else {
    const autor = datosGenerales as Autor;
    desde = autor.desde ? `${autor.desde}` : null;
    desdeAnotacion = autor.desde_anotacion;
    hasta = autor.hasta ? `${autor.hasta}` : null;
    hastaAnotacion = autor.hasta_anotacion;
  }

  if (desde || desdeAnotacion) {
    if (desde && desdeAnotacion) {
      desde += ` (${desdeAnotacion})`;
    } else if (desdeAnotacion) {
      desde = desdeAnotacion;
    }

    respuesta.fechas[0] = desde as string;
  }

  if (hasta || hastaAnotacion) {
    if (respuesta.fechas.length === 0) {
      respuesta.fechas.push('?');
    }

    if (hasta && hastaAnotacion) {
      hasta += ` (${hastaAnotacion})`;
    } else if (hastaAnotacion) {
      hasta = hastaAnotacion;
    }

    respuesta.fechas[1] = hasta as string;
  }

  return { ...datosGenerales, ...respuesta };
}

/**
 * Operaciones en el cliente
 */
const obras: Ref<ObraGaleria[]> = ref([]);
const cargando = ref(false);

if (!datos.value) throw createError({ statusCode: 404, statusMessage: 'No existen datos para esta galería' });

const { data, pending } = obtenerDatosAsinc(
  `obras-${datos.value.id}`,
  datosObrasGaleria(props.coleccion, props.nombreCampo, props.slug, props.enTablaRelacional, paginaActual.value, esId)
);

watch(data, (datosObras: Obra[]) => {
  obras.value = limpiarDatos(datosObras);
});

const numeroPaginas = computed(() => {
  if (datos.value && datos.value.obras_func) {
    return Math.ceil(datos.value.obras_func.count / cerebroArchivo.obrasPorPagina);
  } else {
    return 1;
  }
});

function limpiarDatos(nuevosDatos: { [coleccion: string]: any }) {
  let respuesta;
  const datosObras = props.enTablaRelacional ? nuevosDatos[`obras_${props.coleccion}`] : nuevosDatos.obras;

  // Extraer las obras de colección directamente o de la tabla relacional.
  respuesta = !props.enTablaRelacional
    ? datosObras.map(definirDimsImagen)
    : datosObras.map((obra: ObraEnRelacional) => definirDimsImagen(obra.obras_id));

  return respuesta;
}

function cargarPagina(pagina: number) {
  if (pagina <= numeroPaginas.value) {
    cargando.value = true;
    obtenerDatos(
      `obras-${datos.value?.id}${pagina}`,
      datosObrasGaleria(props.coleccion, props.nombreCampo, props.slug, props.enTablaRelacional, pagina, esId)
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
  <GraficaContador v-if="datos" :numeroObras="datos.obras_func.count" />
  <GaleriaInformacion v-if="datos" :coleccion="coleccion" :datos="datos" />

  <Cargador v-if="pending" />
  <GaleriaMosaico v-else :obras="obras" :pagina="paginaActual" :cargarPagina="cargarPagina" :cargando="cargando" />
</template>
