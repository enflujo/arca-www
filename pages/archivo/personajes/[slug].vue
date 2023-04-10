<script setup>
import { usarArchivo } from '~/cerebros/archivo';
import { gql } from '~/utilidades/ayudas';
import { obrasPorSlug } from '~/utilidades/queries';
const ruta = useRoute();
const datosGenerales = ref([]);
const cerebroArchivo = usarArchivo();
const obras = ref([]);
definePageMeta({ layout: 'archivo', keepalive: true });

const queryPersonaje = gql`
query {
  personajes(filter: { slug: {_eq: "${ruta.params.slug}"} }) {
    nombre
    descripcion
    fuente
    muerte
    muerte_anotacion
    beatificacion_canonizacion_desde
    beatificacion_canonizacion_desde_anotacion
    beatificacion_canonizacion_hasta
    beatificacion_canonizacion_hasta_anotacion
    obras_func {
      count
    }
  }
}
`;

const respuesta = await obtenerDatos(`personaje${ruta.params.slug}`, queryPersonaje);
// Procesar datos generales

function procesarDatosGenerales(datos) {
  const {
    beatificacion_canonizacion_desde,
    beatificacion_canonizacion_desde_anotacion,
    beatificacion_canonizacion_hasta,
    beatificacion_canonizacion_hasta_anotacion,
  } = datos;

  datos.fechas = [];

  if (beatificacion_canonizacion_desde || beatificacion_canonizacion_desde_anotacion) {
    let desde = beatificacion_canonizacion_desde;

    if (desde && beatificacion_canonizacion_desde_anotacion) {
      desde += ` (${beatificacion_canonizacion_desde_anotacion})`;
    } else if (beatificacion_canonizacion_desde_anotacion) {
      desde = beatificacion_canonizacion_desde_anotacion;
    }

    datos.fechas.push(desde);
  }

  if (beatificacion_canonizacion_hasta || beatificacion_canonizacion_hasta_anotacion) {
    if (datos.fechas.length === 0) {
      datos.fechas.push('?');
    }

    let hasta = beatificacion_canonizacion_hasta;

    if (hasta && beatificacion_canonizacion_hasta_anotacion) {
      hasta += ` (${beatificacion_canonizacion_hasta_anotacion})`;
    } else if (beatificacion_canonizacion_hasta_anotacion) {
      hasta = beatificacion_canonizacion_hasta_anotacion;
    }

    datos.fechas.push(hasta);
  }
}

procesarDatosGenerales(respuesta.personajes[0]);

datosGenerales.value = respuesta.personajes[0];

const { data, pending } = obtenerDatosAsinc(
  `personajeObras${ruta.params.slug}`,
  obrasPorSlug('personajes', ruta.params.slug, true)
);

watch(data, ({ personajes }) => {
  obras.value = personajes[0].obras.map((obra) => obra.obras_id);
});
</script>

<template>
  <h1>Personaje - {{ datosGenerales.nombre }}</h1>

  <Cargador v-if="pending" />
  <div v-else>
    <GraficaContador :numeroObras="datosGenerales.obras_func.count" />

    <div v-if="datosGenerales.descripcion" class="info">
      <h3 class="infoTitulo">Descripción:</h3>
      <div v-html="datosGenerales.descripcion" class="infoContenido"></div>
    </div>

    <div v-if="datosGenerales.fuente" class="info">
      <h3 class="infoTitulo">Fuente:</h3>
      <div v-html="datosGenerales.fuente" class="infoContenido"></div>
    </div>

    <div v-if="datosGenerales.muerte" class="info">
      <h3 class="infoTitulo">Muerte:</h3>
      <div class="infoContenido">
        <p>{{ datosGenerales.muerte }} {{ datosGenerales.muerte_anotacion }}</p>
      </div>
    </div>

    <div v-if="datosGenerales.fechas.length" class="info">
      <h3 class="infoTitulo">Beatificación / Canonización:</h3>
      <div class="infoContenido">
        <p>{{ datosGenerales.fechas.join(' - ') }}</p>
      </div>
    </div>

    <GaleriaMosaico :obras="obras" />
  </div>
</template>

<style lang="scss" scoped>
.info {
  font-family: var(--fuenteParrafos);
  margin: 0.5em 1em 0.5em 0;
  display: flex;
}
.infoTitulo {
  font-weight: bold;
  font-size: 1.1em;
}

.infoContenido {
  margin-left: 0.5em;
  padding-top: 0.1em;
}
</style>
